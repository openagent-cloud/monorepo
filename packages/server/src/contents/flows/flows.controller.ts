import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiSecurity
} from '@nestjs/swagger'
import { FlowService } from './flows.service'
import { ErrorResponseDto } from '../../utils/dto/error-response.dto'
import { FlowMutationDto } from './dto/flow-mutation.dto'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { GetTenant, RequireModules } from '../../auth/decorators/auth-decorators'
import { module } from '@prisma/client'

interface FlowChartDto {
  id?: string
  name: string
  nodes?: FlowNodeDto[]
  edges?: FlowEdgeDto[]
}

interface FlowNodeDto {
  id?: string
  chart_id: string
  label: string
  type_id: string
  data: any
  x: number
  y: number
}

interface FlowEdgeDto {
  id?: string
  chart_id: string
  source_node_id: string
  target_node_id: string
  source_handle?: string
  target_handle?: string
  label?: string
}

@ApiTags('Flows')
@Controller('flows')
@UseGuards(AuthGuard)
@RequireModules(module.flows)
@ApiBearerAuth()
@ApiSecurity('api-key')
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing authentication',
  type: ErrorResponseDto
})
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Get()
  @ApiOperation({ summary: 'Get all flows for tenant with summary data' })
  @ApiResponse({ status: 200, description: 'List of flow charts' })
  async getFlows(@GetTenant() tenantId: number) {
    return this.flowService.getFlowsForTenant(tenantId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complete flow chart by ID with all nodes and edges' })
  @ApiParam({ name: 'id', description: 'Flow chart ID' })
  @ApiResponse({ status: 200, description: 'Flow chart details including nodes and edges' })
  @ApiResponse({ status: 404, description: 'Flow chart not found' })
  async getFlowById(@GetTenant() tenantId: number, @Param('id') id: string) {
    return this.flowService.getFlowByIdForTenant(id, tenantId)
  }

  // All mutations now go through the /flows/mutations endpoint
  @Post('mutations')
  @ApiOperation({
    summary: 'Process a batch of generic mutations for flow models',
    description:
      'Handle insert, update, and delete operations for flow_chart, flow_node, flow_edge, and flow_node_type models'
  })
  @ApiBody({
    type: [FlowMutationDto],
    description: 'Array of mutations to process'
  })
  @ApiResponse({
    status: 200,
    description: 'Mutations successfully processed',
    schema: {
      properties: {
        success: { type: 'boolean' },
        txid: { type: 'string' },
        results: { type: 'array', items: { type: 'object' } }
      }
    }
  })
  async processMutations(@GetTenant() tenantId: number, @Body() mutations: FlowMutationDto[]) {
    return this.flowService.processMutations(mutations, tenantId)
  }
}
