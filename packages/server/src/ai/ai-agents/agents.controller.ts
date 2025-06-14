import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiUnauthorizedResponse,
  ApiBody
} from '@nestjs/swagger'
import { AgentsService } from './agents.service'
import { CreateAgentDto } from './dto/create-agent.dto'
import { RunAgentDto } from './dto/run-agent.dto'
import { ApiKey } from '../../utils/decorators/api-key.decorator'
import { ErrorResponseDto } from '../../utils/dto/error-response.dto'

@ApiTags('Agents')
@Controller('agents')
@ApiHeader({
  name: 'x-api-key',
  description: 'Tenant API key for authentication',
  required: true,
  schema: { type: 'string' },
  example: 'tnnt_01h9xgsvs3kqb6qj6zd9kh7qpz'
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing API key',
  type: ErrorResponseDto
})
export class AgentsController {
  private readonly logger = new Logger(AgentsController.name)

  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  @ApiBody({
    type: CreateAgentDto,
    examples: {
      example1: {
        value: {
          name: 'Customer Support Agent',
          instructions:
            'You are a helpful customer support agent. Answer customer questions accurately.',
          model: 'gpt-4-turbo-preview',
          tools: ['web_search', 'knowledge_base'],
          isActive: true
        },
        description: 'Sample agent creation request'
      }
    }
  })
  async createAgent(@ApiKey() apiKey: string, @Body() body: CreateAgentDto) {
    // Validate required fields
    if (!body.name) {
      throw new Error('Agent name is required')
    }

    if (!body.instructions) {
      throw new Error('Agent instructions are required')
    }

    // Handle backward compatibility with prompt field
    if ((body as any).prompt && !body.instructions) {
      body.instructions = (body as any).prompt
    }

    this.logger.log(`Creating agent with name: ${body.name}`)
    return this.agentsService.createAgent(apiKey, body)
  }

  @Get()
  @ApiOperation({ summary: 'List all agents for tenant' })
  @ApiResponse({ status: 200, description: 'List of agents' })
  async listAgents(@ApiKey() apiKey: string) {
    return this.agentsService.listAgents(apiKey)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  @ApiResponse({ status: 200, description: 'Agent found' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async getAgent(@ApiKey() apiKey: string, @Param('id') id: string) {
    return this.agentsService.getAgent(apiKey, id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agent' })
  @ApiResponse({ status: 200, description: 'Agent deleted successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async deleteAgent(@ApiKey() apiKey: string, @Param('id') id: string) {
    return this.agentsService.deleteAgent(apiKey, id)
  }

  @Post(':id/run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run an agent' })
  @ApiResponse({ status: 200, description: 'Agent run completed' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async runAgent(
    @ApiKey() apiKey: string,
    @Param('id') id: string,
    @Body() runAgentDto: RunAgentDto
  ) {
    return this.agentsService.runAgent(apiKey, id, runAgentDto)
  }

  @Post(':id/handoffs/:handoffId')
  @ApiOperation({ summary: 'Add a handoff to an agent' })
  @ApiResponse({ status: 200, description: 'Handoff added successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async addHandoff(
    @ApiKey() apiKey: string,
    @Param('id') id: string,
    @Param('handoffId') handoffId: string
  ) {
    return this.agentsService.addHandoff(apiKey, id, handoffId)
  }
}
