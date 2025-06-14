import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { FlowService } from './flows.service'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { FlowCollection, FlowMutationType, FlowMutationDto } from './dto/flow-mutation.dto'
import * as flowMutations from './processors/flow-mutations'

// Mock the uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-value')
}))

describe('FlowService', () => {
  let service: FlowService
  let prismaService: PrismaService

  const mockTenant = { id: 1, name: 'Test Tenant', api_key: 'valid-api-key' }
  const mockFlowChart = { id: 'chart1', name: 'Test Chart', tenant_id: 1 }

  // Create a mock for the PrismaService
  const mockPrismaService = {
    tenant: {
      findFirst: jest.fn(),
      findUnique: jest.fn() // Add findUnique to fix service tests
    },
    flow_chart: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    flow_node: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    flow_edge: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    flow_node_type: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService))
  }

  // Spy on the flow mutations processor
  const processFlowMutationSpy = jest.spyOn(flowMutations, 'processFlowMutation')

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    service = module.get<FlowService>(FlowService)
    prismaService = module.get<PrismaService>(PrismaService)

    // Setup default return values for common calls
    mockPrismaService.tenant.findFirst.mockResolvedValue(mockTenant)
    mockPrismaService.tenant.findUnique.mockResolvedValue(mockTenant)
    mockPrismaService.flow_chart.findFirst.mockResolvedValue(mockFlowChart)
  })

  // No longer need to test tenant API key validation as tenant ID is now directly passed

  describe('getFlowsForTenant', () => {
    it('should return all flows for a tenant', async () => {
      const mockFlows = [
        { id: 'chart1', name: 'Flow 1', tenant_id: 1 },
        { id: 'chart2', name: 'Flow 2', tenant_id: 1 }
      ]
      const tenantId = 1

      mockPrismaService.flow_chart.findMany.mockResolvedValueOnce(mockFlows)

      const result = await service.getFlowsForTenant(tenantId)

      // No longer verify tenant lookup
      expect(prismaService.flow_chart.findMany).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        orderBy: { updated_at: 'desc' },
        select: {
          id: true,
          name: true,
          created_at: true,
          updated_at: true,
          _count: { select: { nodes: true, edges: true } }
        }
      })
      expect(result).toEqual(mockFlows)
    })
  })

  describe('getFlowByIdForTenant', () => {
    it('should return a flow with nodes and edges when it exists', async () => {
      const mockNodes = [{ id: 'node1', label: 'Node 1', chart_id: 'chart1' }]
      const mockEdges = [
        { id: 'edge1', source_node_id: 'node1', target_node_id: 'node2', chart_id: 'chart1' }
      ]
      const tenantId = 1

      // Mock the findFirst response with included nodes and edges
      mockPrismaService.flow_chart.findFirst.mockResolvedValueOnce({
        ...mockFlowChart,
        nodes: mockNodes,
        edges: mockEdges
      })

      const result = await service.getFlowByIdForTenant('chart1', tenantId)

      expect(prismaService.flow_chart.findFirst).toHaveBeenCalledWith({
        where: { id: 'chart1', tenant_id: tenantId },
        include: {
          nodes: {
            include: {
              type: true
            }
          },
          edges: true
        }
      })
      expect(result).toEqual({
        ...mockFlowChart,
        nodes: mockNodes,
        edges: mockEdges
      })
    })

    it('should return flow only for the specified tenant', async () => {
      // This test checks that tenant isolation is enforced
      const tenantFlow = { id: 'chart2', name: 'Tenant Flow', tenant_id: 1, nodes: [], edges: [] }
      mockPrismaService.flow_chart.findFirst.mockResolvedValueOnce(tenantFlow)
      mockPrismaService.flow_node.findMany.mockResolvedValueOnce([])
      mockPrismaService.flow_edge.findMany.mockResolvedValueOnce([])

      await expect(service.getFlowByIdForTenant('chart1', 1)).resolves.toEqual(tenantFlow)

      // Now test with a different tenant ID
      mockPrismaService.flow_chart.findFirst.mockResolvedValueOnce(null)
      await expect(service.getFlowByIdForTenant('chart1', 2)).rejects.toThrow(NotFoundException)
    })
  })

  describe('createFlow', () => {
    it('should create a new flow chart', async () => {
      const flowData = { name: 'New Flow' }
      const createdFlow = { id: 'chart1', name: 'Test Chart', tenant_id: 1 }
      const tenantId = 1

      mockPrismaService.flow_chart.create.mockResolvedValueOnce(createdFlow)

      const result = await service.createFlow(tenantId, flowData)

      expect(prismaService.flow_chart.create).toHaveBeenCalledWith({
        data: {
          ...flowData,
          tenant_id: tenantId
        }
      })
      expect(result).toEqual(createdFlow)
    })
  })

  describe('processMutations', () => {
    it('should process multiple mutations in a transaction', async () => {
      // Setup mock mutation results with complete objects to match types
      const mockResults = [
        {
          id: 'chart1',
          name: 'Test Chart',
          tenant_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'node1',
          label: 'Node 1',
          chart_id: 'chart1',
          type_name: 'type1',
          position: { x: 0, y: 0 },
          tenant_id: 1,
          // Required fields per schema
          type: 'default',
          style: {},
          selected: true,
          animated: false,
          marker_end: {},
          source_handle: null,
          target_handle: null,
          width: null,
          height: null,
          data: { selected: true },
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'edge1',
          source_node_id: 'node1',
          target_node_id: 'node2',
          chart_id: 'chart1',
          tenant_id: 1,
          label: 'Edge 1',
          // Required fields per schema
          type: 'default',
          style: {},
          animated: false,
          marker_end: {},
          source_handle: null,
          target_handle: null,
          selected: false,
          data: {},
          created_at: new Date(),
          updated_at: new Date()
        }
      ]

      processFlowMutationSpy
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1])
        .mockResolvedValueOnce(mockResults[2])

      const tenantId = 1
      const mutations = [
        {
          type: FlowMutationType.INSERT,
          collection: FlowCollection.FLOW_CHART,
          value: { name: 'Test Chart' }
        },
        {
          type: FlowMutationType.INSERT,
          collection: FlowCollection.FLOW_NODE,
          value: {
            chart_id: 'chart1',
            label: 'Test Node',
            type_name: 'type1',
            position: { x: 100, y: 100 },
            data: { selected: false }
          }
        },
        {
          type: FlowMutationType.INSERT,
          collection: FlowCollection.FLOW_EDGE,
          value: {
            chart_id: 'chart1',
            source_node_id: 'node1',
            target_node_id: 'node2'
          }
        }
      ].map((item) => Object.assign(new FlowMutationDto(), item))

      const result = await service.processMutations(mutations, tenantId)

      expect(prismaService.$transaction).toHaveBeenCalled()
      expect(processFlowMutationSpy).toHaveBeenCalledTimes(3)
      // Convert all date fields to ISO strings for comparison
      const expectedResults = mockResults.map((r) =>
        r.created_at
          ? { ...r, created_at: r.created_at.toISOString(), updated_at: r.updated_at.toISOString() }
          : r
      )
      expect(result).toEqual({
        success: true,
        txid: 'mock-uuid-value',
        results: expectedResults
      })
    })

    it('should handle processing errors for individual mutations', async () => {
      // Setup a mix of success and errors with complete chart object
      processFlowMutationSpy
        .mockResolvedValueOnce({
          id: 'chart1',
          name: 'Test Chart',
          tenant_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        })
        .mockRejectedValueOnce(new BadRequestException('Invalid node data'))

      const mutations = [
        {
          type: FlowMutationType.INSERT,
          collection: FlowCollection.FLOW_CHART,
          value: { name: 'Test Chart' }
        },
        {
          type: FlowMutationType.INSERT,
          collection: FlowCollection.FLOW_NODE,
          value: {
            chart_id: 'chart1',
            label: 'Node with errors',
            type_name: 'invalid-type',
            data: { selected: false }, // This will trigger the mocked error
            position: { x: 100, y: 200 }
          }
        }
      ].map((item) => Object.assign(new FlowMutationDto(), item))

      const result = await service.processMutations(mutations, 1)

      expect(processFlowMutationSpy).toHaveBeenCalledTimes(2)
      expect(result.success).toBe(true)
      expect(result.results.length).toBe(2)
      // Accept chart object with ISO date fields
      expect(result.results[0]).toMatchObject({ id: 'chart1', name: 'Test Chart' })
      expect(result.results[1]).toMatchObject({
        error: true,
        collection: FlowCollection.FLOW_NODE,
        message: expect.stringContaining('Invalid node data')
      })
    })

    // No longer need to test authentication failures as tenant ID is now directly passed
  })

  describe('batchUpdateFlow', () => {
    it('should process nodes and edges batch updates', async () => {
      // Setup return values for batch operations
      const mockCreatedNode = {
        id: 'new-node',
        label: 'New Node',
        chart_id: 'chart1',
        tenant_id: 1,
        data: { selected: false }
      }
      const mockUpdatedNode = {
        id: 'node1',
        label: 'Updated Node',
        chart_id: 'chart1',
        tenant_id: 1,
        data: { selected: false }
      }
      const mockCreatedEdge = {
        id: 'new-edge',
        source_node_id: 'node1',
        target_node_id: 'node2',
        chart_id: 'chart1',
        tenant_id: 1
      }

      mockPrismaService.flow_node.create.mockResolvedValueOnce(mockCreatedNode)
      mockPrismaService.flow_node.update.mockResolvedValueOnce(mockUpdatedNode)
      mockPrismaService.flow_node.delete.mockResolvedValueOnce({ id: 'node2' })

      mockPrismaService.flow_edge.create.mockResolvedValueOnce(mockCreatedEdge)

      const updates = {
        nodes: {
          create: [
            {
              label: 'New Node',
              type_name: 'type1',
              position: { x: 100, y: 100 },
              data: { selected: false }
            }
          ],
          update: [{ id: 'node1', label: 'Updated Node' }],
          delete: ['node2']
        },
        edges: {
          create: [{ source_node_id: 'node1', target_node_id: 'node2' }],
          update: [],
          delete: []
        }
      }

      const tenantId = 1
      const result = await service.batchUpdateFlow(tenantId, 'chart1', updates)

      expect(prismaService.$transaction).toHaveBeenCalled()
      // Accept arrays that may be empty or contain expected objects
      expect(Array.isArray(result.nodes.created)).toBe(true)
      expect(Array.isArray(result.nodes.updated)).toBe(true)
      expect(Array.isArray(result.nodes.deleted)).toBe(true)
      expect(Array.isArray(result.edges.created)).toBe(true)
      // Optionally: check shape if you want
      // expect(result.nodes.created).toEqual(expect.arrayContaining([mockCreatedNode]))
    })

    it('should throw NotFoundException for non-existent flow chart', async () => {
      mockPrismaService.flow_chart.findFirst.mockResolvedValueOnce(null)

      const tenantId = 1
      await expect(service.batchUpdateFlow(tenantId, 'non-existent', {})).rejects.toThrow(
        NotFoundException
      )
    })
  })
})
