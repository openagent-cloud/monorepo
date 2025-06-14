import { Test, TestingModule } from '@nestjs/testing'
import { FlowController } from './flows.controller'
import { FlowService } from './flows.service'
import { FlowMutationType, FlowCollection, FlowMutationDto } from './dto/flow-mutation.dto'
import { AuthGuard } from '../../auth/guards/auth.guard'

// Mock the auth decorators
jest.mock('../../auth/decorators/auth-decorators', () => ({
  GetTenant: jest.fn().mockImplementation(() => {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      return descriptor
    }
  }),
  RequireModules: jest.fn().mockImplementation(() => {
    return (target: any) => target
  })
}))

// Mock AuthGuard
class MockAuthGuard {
  canActivate() {
    return true
  }
}

describe('FlowController', () => {
  let controller: FlowController
  let service: FlowService

  const mockFlowService = {
    getFlowsForTenant: jest.fn(),
    getFlowByIdForTenant: jest.fn(),
    processMutations: jest.fn()
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowController],
      providers: [
        {
          provide: FlowService,
          useValue: mockFlowService
        },
        {
          provide: AuthGuard,
          useClass: MockAuthGuard
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile()

    controller = module.get<FlowController>(FlowController)
    service = module.get<FlowService>(FlowService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllFlows', () => {
    it('should return an array of flows', async () => {
      const mockFlows = [
        { id: '1', name: 'Flow 1', tenant_id: 1 },
        { id: '2', name: 'Flow 2', tenant_id: 1 }
      ]
      const tenantId = 1
      mockFlowService.getFlowsForTenant.mockResolvedValue(mockFlows)

      const result = await controller.getFlows(tenantId)

      expect(service.getFlowsForTenant).toHaveBeenCalledWith(tenantId)
      expect(result).toBe(mockFlows)
    })
  })

  describe('getFlowById', () => {
    it('should return a flow by id', async () => {
      const mockFlow = { id: '1', name: 'Flow 1', tenant_id: 1, nodes: [], edges: [] }
      const tenantId = 1
      mockFlowService.getFlowByIdForTenant.mockResolvedValue(mockFlow)

      const result = await controller.getFlowById(tenantId, '1')

      expect(service.getFlowByIdForTenant).toHaveBeenCalledWith('1', tenantId)
      expect(result).toBe(mockFlow)
    })
  })

  // These endpoints have been removed in favor of the mutations endpoint

  // This endpoint has been removed in favor of the mutations endpoint

  describe('processMutations', () => {
    it('should process valid mutations and return success response', async () => {
      const validMutations = [
        {
          type: FlowMutationType.INSERT,
          collection: FlowCollection.FLOW_CHART,
          value: { name: 'New Flow Chart' } // Valid FlowChartValue
        },
        {
          type: FlowMutationType.UPDATE,
          collection: FlowCollection.FLOW_NODE,
          key: 'node-id',
          value: {
            chart_id: 'chart-id',
            label: 'Updated Node',
            type_id: 'type-id',
            data: {},
            x: 100,
            y: 200
          }
        },
        {
          type: FlowMutationType.REMOVE,
          collection: FlowCollection.FLOW_EDGE,
          key: 'edge-id'
        }
      ].map((item) => Object.assign(new FlowMutationDto(), item))

      const mockMutationResult = {
        success: true,
        txid: 'test-txid',
        results: [
          { id: 'new-chart', name: 'New Flow Chart' },
          { id: 'node-id', label: 'Updated Node' },
          { id: 'edge-id' }
        ]
      }

      mockFlowService.processMutations.mockResolvedValue(mockMutationResult)

      const tenantId = 1
      const result = await controller.processMutations(tenantId, validMutations)

      expect(service.processMutations).toHaveBeenCalledWith(validMutations, tenantId)
      expect(result).toEqual(mockMutationResult)
    })

    it('should handle empty mutations array', async () => {
      const emptyMutations = []

      const mockEmptyResult = {
        success: true,
        txid: 'empty-txid',
        results: []
      }

      mockFlowService.processMutations.mockResolvedValue(mockEmptyResult)

      const tenantId = 1
      const result = await controller.processMutations(tenantId, emptyMutations)

      expect(service.processMutations).toHaveBeenCalledWith(emptyMutations, tenantId)
      expect(result).toEqual(mockEmptyResult)
    })
  })
})
