import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../utils/prisma/prisma.service'
import { FlowCollection, FlowMutationType } from '../dto/flow-mutation.dto'
import { processFlowMutation } from './flow-mutations'
import { Prisma } from '@prisma/client'

describe('Flow Mutations Processor', () => {
  // Mock PrismaService
  // Mock Prisma service with proper mock functions that return promises
  const mockPrismaService = {
    flow_chart: {
      create: jest.fn().mockImplementation(() => Promise.resolve()),
      findFirst: jest.fn().mockImplementation(() => Promise.resolve()),
      findUnique: jest.fn().mockImplementation(() => Promise.resolve()),
      update: jest.fn().mockImplementation(() => Promise.resolve()),
      delete: jest.fn().mockImplementation(() => Promise.resolve())
    },
    flow_node: {
      create: jest.fn().mockImplementation(() => Promise.resolve()),
      findFirst: jest.fn().mockImplementation(() => Promise.resolve()),
      findUnique: jest.fn().mockImplementation(() => Promise.resolve()),
      update: jest.fn().mockImplementation(() => Promise.resolve()),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
      count: jest.fn().mockImplementation(() => Promise.resolve(0))
    },
    flow_edge: {
      create: jest.fn().mockImplementation(() => Promise.resolve()),
      findFirst: jest.fn().mockImplementation(() => Promise.resolve()),
      findUnique: jest.fn().mockImplementation(() => Promise.resolve()),
      update: jest.fn().mockImplementation(() => Promise.resolve()),
      delete: jest.fn().mockImplementation(() => Promise.resolve())
    },
    flow_node_type: {
      create: jest.fn().mockImplementation(() => Promise.resolve()),
      findFirst: jest.fn().mockImplementation(() => Promise.resolve()),
      findUnique: jest.fn().mockImplementation(() => Promise.resolve()),
      update: jest.fn().mockImplementation(() => Promise.resolve()),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
      count: jest.fn().mockImplementation(() => Promise.resolve(0))
    }
  } as unknown as PrismaService

  const mockTenantId = 1

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Flow Chart mutations', () => {
    it('should create a flow chart', async () => {
      const chartData = {
        name: 'Test Chart'
      }

      const expectedChart = {
        id: 'chart1',
        name: 'Test Chart',
        tenant_id: mockTenantId,
        created_at: new Date(),
        updated_at: new Date()
      }

      jest.spyOn(mockPrismaService.flow_chart, 'create').mockResolvedValue(expectedChart)

      const result = await processFlowMutation(
        mockPrismaService,
        FlowMutationType.INSERT,
        FlowCollection.FLOW_CHART,
        mockTenantId,
        undefined,
        chartData
      )

      expect(mockPrismaService.flow_chart.create).toHaveBeenCalled()
      expect(result).toEqual(expectedChart)
    })

    it('should update a flow chart', async () => {
      const chartId = 'chart1'
      const updateData = {
        name: 'Updated Chart'
      }

      const existingChart = {
        id: chartId,
        name: 'Test Chart',
        tenant_id: mockTenantId,
        created_at: new Date(),
        updated_at: new Date()
      }

      const updatedChart = {
        ...existingChart,
        name: 'Updated Chart',
        updated_at: new Date()
      }

      jest.spyOn(mockPrismaService.flow_chart, 'findFirst').mockResolvedValue(existingChart)
      jest.spyOn(mockPrismaService.flow_chart, 'update').mockResolvedValue(updatedChart)

      const result = await processFlowMutation(
        mockPrismaService,
        FlowMutationType.UPDATE,
        FlowCollection.FLOW_CHART,
        mockTenantId,
        chartId,
        updateData
      )

      expect(mockPrismaService.flow_chart.findFirst).toHaveBeenCalledWith({
        where: {
          id: chartId,
          tenant_id: mockTenantId
        }
      })
      expect(mockPrismaService.flow_chart.update).toHaveBeenCalled()
      expect(result).toEqual(updatedChart)
    })

    it('should delete a flow chart', async () => {
      const chartId = 'chart1'

      const existingChart = {
        id: chartId,
        name: 'Test Chart',
        tenant_id: mockTenantId,
        created_at: new Date(),
        updated_at: new Date()
      }

      jest.spyOn(mockPrismaService.flow_chart, 'findFirst').mockResolvedValue(existingChart)
      jest.spyOn(mockPrismaService.flow_chart, 'delete').mockResolvedValue(existingChart)

      const result = await processFlowMutation(
        mockPrismaService,
        FlowMutationType.REMOVE,
        FlowCollection.FLOW_CHART,
        mockTenantId,
        chartId
      )

      expect(mockPrismaService.flow_chart.delete).toHaveBeenCalledWith({
        where: { id: chartId }
      })
      expect(result).toEqual(existingChart)
    })

    it('should throw NotFoundException when updating non-existent chart', async () => {
      jest.spyOn(mockPrismaService.flow_chart, 'findFirst').mockResolvedValue(null)

      await expect(
        processFlowMutation(
          mockPrismaService,
          FlowMutationType.UPDATE,
          FlowCollection.FLOW_CHART,
          mockTenantId,
          'non-existent',
          { name: 'Updated Name' }
        )
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('Flow Node mutations', () => {
    it('should create a flow node', async () => {
      const nodeData = {
        chart_id: 'chart1',
        label: 'Test Node',
        type_name: 'type1', // Updated from type_id to type_name
        position: { x: 100, y: 200 },
        data: { selected: false }
        // No longer need separate selected as it's in data
      }

      const expectedNode = {
        id: 'node1',
        chart_id: nodeData.chart_id,
        label: nodeData.label,
        type_name: nodeData.type_name, // Updated from type_id to type_name
        position: nodeData.position,
        data: nodeData.data,
        tenant_id: mockTenantId, // Required per schema
        // Required fields per schema
        style: {},
        animated: false,
        marker_end: {},
        source_handle: null,
        target_handle: null,
        width: null,
        height: null,
        selected: false, // Already in data but needed for schema
        created_at: new Date(),
        updated_at: new Date()
      }

      // Fix the missing properties in the mock
      jest.spyOn(mockPrismaService.flow_chart, 'findFirst').mockResolvedValue({
        id: 'chart1',
        name: 'Test Chart',
        tenant_id: mockTenantId,
        created_at: new Date(),
        updated_at: new Date()
      })
      jest.spyOn(mockPrismaService.flow_node, 'create').mockResolvedValue(expectedNode)

      const result = await processFlowMutation(
        mockPrismaService,
        FlowMutationType.INSERT,
        FlowCollection.FLOW_NODE,
        mockTenantId,
        undefined,
        nodeData
      )

      expect(mockPrismaService.flow_chart.findFirst).toHaveBeenCalledWith({
        where: {
          id: nodeData.chart_id,
          tenant_id: mockTenantId
        }
      })
      expect(mockPrismaService.flow_node.create).toHaveBeenCalled()
      expect(result).toEqual(expectedNode)
    })

    it('should throw NotFoundException when creating node for non-existent chart', async () => {
      jest.spyOn(mockPrismaService.flow_chart, 'findFirst').mockResolvedValue(null)

      await expect(
        processFlowMutation(
          mockPrismaService,
          FlowMutationType.INSERT,
          FlowCollection.FLOW_NODE,
          mockTenantId,
          undefined,
          { chart_id: 'non-existent' }
        )
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('Flow Edge mutations', () => {
    it('should create a flow edge', async () => {
      const edgeData = {
        chart_id: 'chart1',
        source_node_id: 'node1',
        target_node_id: 'node2'
      }

      const expectedEdge = {
        id: 'edge1',
        chart_id: edgeData.chart_id,
        source_node_id: edgeData.source_node_id,
        target_node_id: edgeData.target_node_id,
        tenant_id: mockTenantId, // Required per schema
        label: '',
        source_handle: '',
        target_handle: '',
        type: 'default', // Add required type field
        data: {}, // Add required data
        style: {}, // Add required style
        animated: false, // Add required animated
        marker_end: {}, // Add required marker_end
        selected: false, // Add required selected field
        created_at: new Date(),
        updated_at: new Date()
      }

      // Fix the missing properties in the mock
      jest.spyOn(mockPrismaService.flow_chart, 'findFirst').mockResolvedValue({
        id: 'chart1',
        name: 'Test Chart',
        tenant_id: mockTenantId,
        created_at: new Date(),
        updated_at: new Date()
      })
      jest.spyOn(mockPrismaService.flow_edge, 'create').mockResolvedValue(expectedEdge)

      const result = await processFlowMutation(
        mockPrismaService,
        FlowMutationType.INSERT,
        FlowCollection.FLOW_EDGE,
        mockTenantId,
        undefined,
        edgeData
      )

      expect(mockPrismaService.flow_chart.findFirst).toHaveBeenCalledWith({
        where: {
          id: edgeData.chart_id,
          tenant_id: mockTenantId
        }
      })
      expect(mockPrismaService.flow_edge.create).toHaveBeenCalled()
      expect(result).toEqual(expectedEdge)
    })
  })

  describe('Flow Node Type mutations', () => {
    it('should create a flow node type', async () => {
      const typeData = {
        name: 'Test Type'
      }

      const expectedNodeType = {
        id: 'type1',
        name: 'test-type',
        label: 'Test Type',
        tenant_id: mockTenantId,
        description: null, // Required per schema
        created_at: new Date(),
        updated_at: new Date()
      }

      jest.spyOn(mockPrismaService.flow_node_type, 'create').mockResolvedValue(expectedNodeType)

      const result = await processFlowMutation(
        mockPrismaService,
        FlowMutationType.INSERT,
        FlowCollection.FLOW_NODE_TYPE,
        mockTenantId,
        undefined,
        typeData
      )

      expect(mockPrismaService.flow_node_type.create).toHaveBeenCalled()
      expect(result).toEqual(expectedNodeType)
    })

    it('should prevent deletion of node type that is in use', async () => {
      const typeId = 'type1'

      jest.spyOn(mockPrismaService.flow_node_type, 'findUnique').mockResolvedValue({
        id: typeId,
        name: 'test-type',
        label: 'Test Type',
        tenant_id: mockTenantId,
        description: null,
        created_at: new Date(),
        updated_at: new Date()
      })

      // Simulate a node using this type
      jest.spyOn(mockPrismaService.flow_node, 'findFirst').mockResolvedValue({
        id: 'node1',
        chart_id: 'chart1',
        type_name: typeId, // Updated from type_id to type_name
        tenant_id: mockTenantId, // Required per schema
        label: 'Test Node',
        data: { selected: false }, // Move selected into data
        position: { x: 0, y: 0 },
        width: null,
        height: null,
        created_at: new Date(),
        updated_at: new Date()
      })

      // Count nodes using this type
      jest.spyOn(mockPrismaService.flow_node, 'count').mockResolvedValue(5)

      await expect(
        processFlowMutation(
          mockPrismaService,
          FlowMutationType.REMOVE,
          FlowCollection.FLOW_NODE_TYPE,
          mockTenantId,
          typeId
        )
      ).rejects.toThrow(BadRequestException)
    })
  })
})
