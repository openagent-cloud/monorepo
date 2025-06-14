import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Agent, run, setDefaultOpenAIKey } from '@openai/agents'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { ConfigService } from '../../utils/config/config.service'
import { CreateAgentDto } from './dto/create-agent.dto'
import { RunAgentDto } from './dto/run-agent.dto'
import { safeDecrypt } from '../../utils/encryption/encryption.util'
import sha256_hash_tool from './tools/sha256_hash_tool'

// Define AgentRunResult interface and export it
export interface AgentRunResult {
  output: string
  runId: string
  metadata?: Record<string, any>
}

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name)
  private agentCache = new Map<string, Agent>()

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  /**
   * Helper method to get tenant ID from API key
   */
  private async getTenantFromApiKey(apiKey: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { api_key: apiKey }
    })

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    return tenant
  }

  /**
   * Helper method to get OpenAI API key for a tenant
   */
  private async getOpenAIApiKey(tenantId: number) {
    const credential = await this.prisma.credential.findFirst({
      where: {
        tenant_id: tenantId,
        service: 'openai'
      }
    })

    if (!credential) {
      throw new UnauthorizedException('OpenAI credentials not found for this tenant')
    }

    try {
      // Use our safe decryption helper
      return safeDecrypt(credential.encrypted_key, this.configService.encryptionKey)
    } catch (error) {
      this.logger.error(`Failed to decrypt OpenAI API key: ${error.message}`)
      throw new Error('Failed to decrypt OpenAI API key')
    }
  }

  async createAgent(apiKey: string, data: CreateAgentDto) {
    const tenant = await this.getTenantFromApiKey(apiKey)

    // CRITICAL: Validate required fields to avoid DB errors
    if (!data.name) {
      throw new Error('Agent name is required')
    }

    if (!data.instructions) {
      throw new Error('Agent instructions are required')
    }

    // Log basic info about the agent
    this.logger.log(`Creating agent with name: ${data.name}`)

    // Extract handoffs from data if present to handle them properly
    const { handoffs, isActive, ...restData } = data

    // Create proper Prisma structure with EXPLICIT required fields
    const createData = {
      name: data.name,
      instructions: data.instructions,
      description: data.description,
      model: data.model,
      tenant_id: tenant.id,
      tools: data.tools || [],
      is_active: isActive ?? true
    }

    this.logger.log(`Creating agent: ${createData.name}`)

    // If handoffs are provided, set them up using Prisma's connect syntax
    if (handoffs && handoffs.length > 0) {
      createData['handoffs'] = {
        connect: handoffs.map((id) => ({ id }))
      }
    }

    // Log basic agent creation data
    this.logger.log(
      `Creating agent in DB with name: ${createData.name} for tenant: ${createData.tenant_id}`
    )

    return this.prisma.agent.create({
      data: createData
    })
  }

  async getAgent(apiKey: string, id: string) {
    const tenant = await this.getTenantFromApiKey(apiKey)

    return this.prisma.agent.findUnique({
      where: { id, tenant_id: tenant.id },
      include: { handoffs: true }
    })
  }

  async listAgents(apiKey: string) {
    const tenant = await this.getTenantFromApiKey(apiKey)

    return this.prisma.agent.findMany({
      where: { tenant_id: tenant.id },
      select: {
        id: true,
        name: true,
        description: true,
        model: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: { runs: true, handoffs: true }
        }
      }
    })
  }

  async deleteAgent(apiKey: string, id: string) {
    const tenant = await this.getTenantFromApiKey(apiKey)

    const agent = await this.prisma.agent.findUnique({
      where: { id, tenant_id: tenant.id }
    })

    if (!agent) {
      throw new NotFoundException('Agent not found')
    }

    // Remove from cache if exists
    this.agentCache.delete(id)

    return this.prisma.agent.delete({
      where: { id }
    })
  }

  async runAgent(apiKey: string, agentId: string, options: RunAgentDto): Promise<AgentRunResult> {
    const tenant = await this.getTenantFromApiKey(apiKey)
    const agentData = await this.prisma.agent.findUnique({
      where: { id: agentId, tenant_id: tenant.id },
      include: { handoffs: true }
    })

    if (!agentData) {
      throw new NotFoundException('Agent not found')
    }

    // Log the agent run attempt with details
    this.logger.log(`Running agent ${agentId} (${agentData.name}) for tenant ${tenant.id}`)
    this.logger.log(
      `Agent model: ${agentData.model}, Tools: ${agentData.tools?.join(', ') || 'none'}`
    )

    // Get OpenAI API key from credential store for this tenant
    const openAiKey = await this.getOpenAIApiKey(tenant.id)

    // Important: Use or create an agent instance for this specific run
    // We might have previously cached the agent, but the OpenAI key could have changed
    // So we reset the key before each run to ensure we're using the current tenant credentials
    let agent = this.agentCache.get(agentId)
    if (!agent) {
      this.logger.log(`Agent ${agentData.name} not found in cache, creating new instance`)
      agent = await this.createAgentInstance(agentData, openAiKey)
      this.agentCache.set(agentId, agent)
    } else {
      this.logger.log(`Using cached agent ${agentData.name} with fresh API key`)
      setDefaultOpenAIKey(openAiKey)
    }

    const agentRun = await this.prisma.agent_run.create({
      data: {
        agent_id: agentId,
        input: options.input,
        status: 'running',
        metadata: options.metadata || {},
        tenant_id: tenant.id
      }
    })

    try {
      const result = await run(agent, options.input)
      // Create a safe serializable result object
      // We extract just the finalOutput as a string and stringify the rest
      const serializedResult = {
        finalOutput: result.finalOutput || '',
        // Safely store a string representation of the result
        resultSummary: JSON.stringify({
          completed: true,
          timestamp: new Date().toISOString(),
          hasOutput: !!result.finalOutput
        })
      }

      await this.prisma.agent_run.update({
        where: { id: agentRun.id },
        data: {
          status: 'completed',
          output: result.finalOutput,
          metadata: {
            ...((agentRun.metadata as Record<string, any>) || {}),
            result: serializedResult,
            completedAt: new Date().toISOString()
          }
        }
      })
      return {
        output: result.finalOutput || '',
        runId: agentRun.id,
        metadata: serializedResult
      }
    } catch (error) {
      this.logger.error(`Agent run failed: ${error.message}`, error.stack)
      await this.prisma.agent_run.update({
        where: { id: agentRun.id },
        data: {
          status: 'failed',
          metadata: {
            ...((agentRun.metadata as Record<string, any>) || {}),
            error: error.message,
            stack: error.stack,
            failedAt: new Date().toISOString()
          }
        }
      })
      throw error
    }
  }

  async addHandoff(apiKey: string, agentId: string, handoffId: string) {
    const tenant = await this.getTenantFromApiKey(apiKey)

    // Verify both agents exist and belong to the tenant
    const [agent, handoffAgent] = await Promise.all([
      this.prisma.agent.findUnique({ where: { id: agentId, tenant_id: tenant.id } }),
      this.prisma.agent.findUnique({ where: { id: handoffId, tenant_id: tenant.id } })
    ])

    if (!agent || !handoffAgent) {
      throw new NotFoundException('Agent not found')
    }

    // Update the relationship using Prisma's connect API
    const updatedAgent = await this.prisma.agent.update({
      where: { id: agentId },
      data: {
        handoffs: {
          connect: { id: handoffId }
        }
      },
      include: { handoffs: true }
    })

    // Invalidate cache since relationships changed
    this.agentCache.delete(agentId)

    return updatedAgent
  }

  private async createAgentInstance(agentData: any, openAiApiKey: string): Promise<Agent> {
    const tools = this.getAvailableTools(agentData.tools || [])

    // Set the OpenAI API key for this specific agent instance
    // This approach uses a scoped function that sets the key for subsequent agent operations
    setDefaultOpenAIKey(openAiApiKey)

    // Extract any additional config options from the database
    let additionalConfig = {}
    try {
      // The config field is already JSON in the database
      if (agentData.config && typeof agentData.config === 'object') {
        additionalConfig = agentData.config
        this.logger.log(
          `Found additional config options: ${Object.keys(additionalConfig).join(', ')}`
        )
      }
    } catch (error) {
      this.logger.warn(`Failed to parse config for agent ${agentData.name}: ${error.message}`)
    }

    // Build comprehensive identity for the agent based on all DB data
    let enhancedInstructions = agentData.instructions
    const identityStatements = [
      `You are ${agentData.name}.`,
      agentData.description ? `Your description: ${agentData.description}` : null,
      `You must always identify yourself as "${agentData.name}".`,
      agentData.tools?.length
        ? `You have the following tools available: ${agentData.tools.join(', ')}`
        : null,
      `You run on the ${agentData.model || 'default'} model.`
    ]
      .filter(Boolean)
      .join('\n')

    enhancedInstructions = `${identityStatements}\n\n${enhancedInstructions || ''}`
    this.logger.log(`Enhanced instructions with complete agent identity`)

    // Combine all agent data from our database with any additional config
    const agentFullInfo = {
      name: agentData.name,
      description: agentData.description || `${agentData.name} is an AI assistant`,
      instructions: enhancedInstructions,
      tools: tools,
      model: agentData.model || 'gpt-4-turbo-preview',
      ...additionalConfig // Merge any additional config options
    }

    this.logger.log(`Creating agent ${agentData.name}:`)
    this.logger.log(
      `- Description: ${agentFullInfo.description?.substring(0, 50)}${agentFullInfo.description?.length > 50 ? '...' : ''}`
    )
    this.logger.log(
      `- Instructions: ${agentFullInfo.instructions?.substring(0, 50)}${agentFullInfo.instructions?.length > 50 ? '...' : ''}`
    )
    this.logger.log(`- Model: ${agentFullInfo.model}`)

    return new Agent(agentFullInfo)
  }

  private getAvailableTools(toolNames: string[]) {
    const availableTools: any[] = []

    // Add SHA256 hash tool
    if (toolNames.some((t) => t.includes('sha256'))) {
      availableTools.push(sha256_hash_tool)
    }

    return availableTools
  }
}
