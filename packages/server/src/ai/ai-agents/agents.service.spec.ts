import { AgentsService } from './agents.service'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { ConfigService } from '../../utils/config/config.service'
import { UnauthorizedException, NotFoundException } from '@nestjs/common'
import { CreateAgentDto } from './dto/create-agent.dto'
import { RunAgentDto } from './dto/run-agent.dto'

// Mock the modules that use ES imports
// This MUST be before any imports that use these modules
jest.mock(
  '@openai/agents',
  () => ({
    Agent: jest.fn().mockImplementation(() => ({
      // Mock agent methods
    })),
    run: jest.fn().mockImplementation(() =>
      Promise.resolve({
        finalOutput: 'mock agent output'
      })
    ),
    tool: jest.fn(),
    setDefaultOpenAIKey: jest.fn()
  }),
  { virtual: true }
)

// Mock crypto for decryption functions
jest.mock('crypto', () => {
  return {
    createHash: jest.fn().mockImplementation(() => ({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('mocked-hash')
    })),
    createDecipheriv: jest.fn().mockImplementation(() => ({
      setAuthTag: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnValue(Buffer.from('decrypted')),
      final: jest.fn().mockReturnValue(Buffer.from('-openai-key'))
    }))
  }
})

// Because we're not actually running the decryption logic but mocking it,
// we need to directly mock the point where our service would extract the decrypted key
jest.spyOn(Buffer.prototype, 'toString').mockReturnValue('decrypted-openai-key')

describe('AgentsService', () => {
  let service: AgentsService
  let prismaService: PrismaService
  let configService: ConfigService

  const mockPrismaService = {
    tenant: {
      findUnique: jest.fn()
    },
    credential: {
      findFirst: jest.fn()
    },
    agent: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    agent_run: {
      create: jest.fn(),
      update: jest.fn()
    }
  }

  const mockConfigService = {
    encryptionKey: Buffer.from('test-encryption-key')
  }

  // Sample test data
  const mockApiKey = 'test-api-key'
  const mockTenant = { id: 1, name: 'Test Tenant', api_key: mockApiKey }
  const mockCredential = {
    id: 1,
    tenant_id: 1,
    service: 'openai',
    encrypted_key: JSON.stringify({
      iv: 'mock-iv',
      encrypted: 'mock-encrypted',
      authTag: 'mock-auth-tag'
    })
  }
  const mockAgent = {
    id: 'agent-id-1',
    name: 'Test Agent',
    tenant_id: 1,
    tools: ['sha256_hash'],
    instructions: 'Test instructions',
    model: 'gpt-4',
    handoffs: [],
    is_active: true
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    // Make a real concrete implementation that we can test directly
    // This is more aggressive than mocking but gives us reliable tests
    service = new AgentsService(
      mockPrismaService as unknown as PrismaService,
      mockConfigService as unknown as ConfigService
    )

    prismaService = mockPrismaService as unknown as PrismaService
    configService = mockConfigService as unknown as ConfigService

    // Set up default mock responses
    mockPrismaService.tenant.findUnique.mockResolvedValue(mockTenant)
    mockPrismaService.credential.findFirst.mockResolvedValue(mockCredential)
    mockPrismaService.agent.findUnique.mockResolvedValue(mockAgent)
    mockPrismaService.agent.findMany.mockResolvedValue([mockAgent])
    mockPrismaService.agent.create.mockResolvedValue(mockAgent)
    mockPrismaService.agent.update.mockResolvedValue(mockAgent)
    mockPrismaService.agent.delete.mockResolvedValue(mockAgent)
    mockPrismaService.agent_run.create.mockResolvedValue({
      id: 'run-id-1',
      agent_id: mockAgent.id,
      input: 'Test input',
      status: 'running',
      metadata: {}
    })
  })

  describe('getTenantFromApiKey', () => {
    it('should return tenant when valid API key provided', async () => {
      // We need to access the private method using any type
      const result = await (service as any).getTenantFromApiKey(mockApiKey)
      expect(result).toEqual(mockTenant)
      expect(mockPrismaService.tenant.findUnique).toHaveBeenCalledWith({
        where: { api_key: mockApiKey }
      })
    })

    it('should throw UnauthorizedException when no tenant found', async () => {
      mockPrismaService.tenant.findUnique.mockResolvedValueOnce(null)
      await expect((service as any).getTenantFromApiKey(mockApiKey)).rejects.toThrow(
        UnauthorizedException
      )
    })
  })

  describe('getOpenAIApiKey', () => {
    it('should return decrypted API key when credentials exist', async () => {
      const result = await (service as any).getOpenAIApiKey(mockTenant.id)
      expect(result).toEqual('decrypted-openai-key')
      expect(mockPrismaService.credential.findFirst).toHaveBeenCalledWith({
        where: {
          tenant_id: mockTenant.id,
          service: 'openai'
        }
      })
    })

    it('should throw UnauthorizedException when no credentials found', async () => {
      mockPrismaService.credential.findFirst.mockResolvedValueOnce(null)
      await expect((service as any).getOpenAIApiKey(mockTenant.id)).rejects.toThrow(
        UnauthorizedException
      )
    })
  })

  describe('createAgent', () => {
    it('should create an agent when valid data provided', async () => {
      const createAgentDto: CreateAgentDto = {
        name: 'New Agent',
        instructions: 'Test instructions',
        tools: ['sha256_hash']
      }

      await service.createAgent(mockApiKey, createAgentDto)

      expect(mockPrismaService.tenant.findUnique).toHaveBeenCalled()
      expect(mockPrismaService.agent.create).toHaveBeenCalled()
    })

    it('should handle handoff connections when provided', async () => {
      const createAgentDto: CreateAgentDto = {
        name: 'New Agent',
        instructions: 'Test instructions',
        tools: ['sha256_hash'],
        handoffs: ['agent-id-2']
      }

      await service.createAgent(mockApiKey, createAgentDto)

      expect(mockPrismaService.agent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            handoffs: {
              connect: [{ id: 'agent-id-2' }]
            }
          })
        })
      )
    })
  })

  describe('getAgent', () => {
    it('should return agent if it belongs to tenant', async () => {
      const result = await service.getAgent(mockApiKey, mockAgent.id)
      expect(result).toEqual(mockAgent)
      expect(mockPrismaService.tenant.findUnique).toHaveBeenCalled()
      expect(mockPrismaService.agent.findUnique).toHaveBeenCalledWith({
        where: { id: mockAgent.id, tenant_id: mockTenant.id },
        include: { handoffs: true }
      })
    })

    it('should return null when agent not found', async () => {
      mockPrismaService.agent.findUnique.mockResolvedValueOnce(null)
      const result = await service.getAgent(mockApiKey, 'non-existent')
      expect(result).toBeNull()
    })
  })

  describe('listAgents', () => {
    it('should return list of agents for tenant', async () => {
      const result = await service.listAgents(mockApiKey)
      expect(result).toEqual([mockAgent])
      expect(mockPrismaService.tenant.findUnique).toHaveBeenCalled()
      expect(mockPrismaService.agent.findMany).toHaveBeenCalled()
    })
  })

  describe('deleteAgent', () => {
    it('should delete agent if it belongs to tenant', async () => {
      await service.deleteAgent(mockApiKey, mockAgent.id)
      expect(mockPrismaService.tenant.findUnique).toHaveBeenCalled()
      expect(mockPrismaService.agent.findUnique).toHaveBeenCalled()
      expect(mockPrismaService.agent.delete).toHaveBeenCalledWith({
        where: { id: mockAgent.id }
      })
    })

    it('should throw NotFoundException when agent not found', async () => {
      mockPrismaService.agent.findUnique.mockResolvedValueOnce(null)
      await expect(service.deleteAgent(mockApiKey, 'non-existent')).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('addHandoff', () => {
    it('should add handoff relationship between agents', async () => {
      const handoffId = 'agent-id-2'
      mockPrismaService.agent.findUnique
        .mockResolvedValueOnce(mockAgent)
        .mockResolvedValueOnce({ ...mockAgent, id: handoffId })

      await service.addHandoff(mockApiKey, mockAgent.id, handoffId)

      expect(mockPrismaService.tenant.findUnique).toHaveBeenCalled()
      expect(mockPrismaService.agent.findUnique).toHaveBeenCalledTimes(2)
      expect(mockPrismaService.agent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockAgent.id },
          data: {
            handoffs: {
              connect: { id: handoffId }
            }
          },
          include: { handoffs: true }
        })
      )
    })

    it('should throw NotFoundException when either agent not found', async () => {
      mockPrismaService.agent.findUnique
        .mockResolvedValueOnce(mockAgent)
        .mockResolvedValueOnce(null)

      await expect(service.addHandoff(mockApiKey, mockAgent.id, 'non-existent')).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('runAgent', () => {
    const runAgentDto: RunAgentDto = {
      input: 'Test input',
      metadata: { test: 'value' }
    }

    beforeEach(() => {
      // Mock the run method from @openai/agents
      const { run } = require('@openai/agents')
      run.mockResolvedValue({
        finalOutput: 'Test output'
      })
    })

    it('should create run and execute agent', async () => {
      // Mock agent cache handling
      jest.spyOn(Map.prototype, 'get').mockReturnValue(null)
      jest.spyOn(Map.prototype, 'set')

      const result = await service.runAgent(mockApiKey, mockAgent.id, runAgentDto)

      expect(result).toEqual(
        expect.objectContaining({
          output: 'Test output',
          runId: expect.any(String)
        })
      )

      expect(mockPrismaService.tenant.findUnique).toHaveBeenCalled()
      expect(mockPrismaService.agent.findUnique).toHaveBeenCalled()
      expect(mockPrismaService.credential.findFirst).toHaveBeenCalled()
      expect(mockPrismaService.agent_run.create).toHaveBeenCalled()
      expect(mockPrismaService.agent_run.update).toHaveBeenCalled()

      const { setDefaultOpenAIKey } = require('@openai/agents')
      expect(setDefaultOpenAIKey).toHaveBeenCalledWith('decrypted-openai-key')
    })

    it('should use cached agent if available', async () => {
      // Mock a cached agent
      const mockCachedAgent = {}
      jest.spyOn(Map.prototype, 'get').mockReturnValue(mockCachedAgent)

      await service.runAgent(mockApiKey, mockAgent.id, runAgentDto)

      const { setDefaultOpenAIKey } = require('@openai/agents')
      expect(setDefaultOpenAIKey).toHaveBeenCalledWith('decrypted-openai-key')
    })

    it('should throw NotFoundException when agent not found', async () => {
      mockPrismaService.agent.findUnique.mockResolvedValueOnce(null)

      await expect(service.runAgent(mockApiKey, 'non-existent', runAgentDto)).rejects.toThrow(
        NotFoundException
      )
    })

    it('should handle run errors properly', async () => {
      const { run } = require('@openai/agents')
      const error = new Error('Test error')
      run.mockRejectedValueOnce(error)

      await expect(service.runAgent(mockApiKey, mockAgent.id, runAgentDto)).rejects.toThrow(error)

      expect(mockPrismaService.agent_run.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(),
          data: expect.objectContaining({
            status: 'failed'
          })
        })
      )
    })
  })
})
