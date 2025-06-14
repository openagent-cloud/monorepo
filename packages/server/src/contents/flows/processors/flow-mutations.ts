import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../utils/prisma/prisma.service'
import { FlowCollection, FlowMutationType } from '../dto/flow-mutation.dto'
import { Prisma } from '@prisma/client'

/**
 * Process a single flow-related mutation
 */
export async function processFlowMutation(
  prisma: PrismaService,
  type: FlowMutationType,
  collection: FlowCollection,
  tenantId: number,
  key?: string,
  value?: Record<string, any>
) {
  switch (collection) {
    case FlowCollection.FLOW_CHART:
      return processFlowChartMutation(prisma, type, tenantId, key, value)
    case FlowCollection.FLOW_NODE:
      return processFlowNodeMutation(prisma, type, tenantId, key, value)
    case FlowCollection.FLOW_EDGE:
      return processFlowEdgeMutation(prisma, type, tenantId, key, value)
    case FlowCollection.FLOW_NODE_TYPE:
      return processFlowNodeTypeMutation(prisma, type, tenantId, key, value)
    default:
      throw new BadRequestException(`Unknown collection: ${collection}`)
  }
}

/**
 * Process flow chart mutations
 */
async function processFlowChartMutation(
  prisma: PrismaService,
  type: FlowMutationType,
  tenantId: number,
  key?: string,
  value?: Record<string, any>
) {
  switch (type) {
    case FlowMutationType.INSERT:
      if (!value) throw new BadRequestException('Value is required for INSERT')

      // Ensure we have required fields and the proper tenant ID
      const flowChartData: Prisma.flow_chartCreateInput = {
        name: value.name || 'Untitled Flow',
        tenant: { connect: { id: tenantId } },
        ...value
      }

      // Remove tenant_id from input if present as we're using proper relation
      if ('tenant_id' in flowChartData) {
        delete (flowChartData as any).tenant_id
      }

      return await prisma.flow_chart.create({ data: flowChartData })

    case FlowMutationType.UPDATE:
      if (!key) throw new BadRequestException('Key is required for UPDATE')
      if (!value) throw new BadRequestException('Value is required for UPDATE')

      // Verify chart belongs to tenant
      const existingChart = await prisma.flow_chart.findFirst({
        where: {
          id: key,
          tenant_id: tenantId
        }
      })

      if (!existingChart) {
        throw new NotFoundException(`Flow chart with ID ${key} not found`)
      }

      return await prisma.flow_chart.update({
        where: { id: key },
        data: value
      })

    case FlowMutationType.REMOVE:
      if (!key) throw new BadRequestException('Key is required for REMOVE')

      // Verify chart belongs to tenant
      const chartToDelete = await prisma.flow_chart.findFirst({
        where: {
          id: key,
          tenant_id: tenantId
        }
      })

      if (!chartToDelete) {
        throw new NotFoundException(`Flow chart with ID ${key} not found`)
      }

      // Thanks to cascade deletes, this will also delete nodes and edges
      return await prisma.flow_chart.delete({
        where: { id: key }
      })

    default:
      throw new BadRequestException(`Unknown mutation type: ${type}`)
  }
}

/**
 * Process flow node mutations
 */
async function processFlowNodeMutation(
  prisma: PrismaService,
  type: FlowMutationType,
  tenantId: number,
  key?: string,
  value?: Record<string, any>
) {
  switch (type) {
    case FlowMutationType.INSERT:
      if (!value) throw new BadRequestException('Value is required for INSERT')
      if (!value.chart_id) throw new BadRequestException('chart_id is required for flow node')

      // Verify chart belongs to tenant
      const chart = await prisma.flow_chart.findFirst({
        where: {
          id: value.chart_id,
          tenant_id: tenantId
        }
      })

      if (!chart) {
        throw new NotFoundException(`Flow chart with ID ${value.chart_id} not found`)
      }

      // Get the type name directly (preferred) or convert from legacy type_id
      let typeName = value.type_name

      // Legacy compatibility: if type_id is provided instead of type_name, use it directly as the type name
      // The database field has been renamed from type_id to type_name
      if (value.type_id && !typeName) {
        typeName = value.type_id
      }

      if (!typeName) {
        throw new BadRequestException('type_name is required for flow node')
      }

      // Type the data properly for flow_node
      const nodeData: Prisma.flow_nodeCreateInput = {
        chart: { connect: { id: value.chart_id } },
        label: value.label || '',
        type: typeName ? { connect: { name: typeName } } : undefined,
        position: value.position || { x: 0, y: 0 },
        tenant: { connect: { id: tenantId } },
        data: {
          ...(value.data || {}),
          selected: value.selected !== undefined ? value.selected : false
        },
        ...value
      }

      // Remove fields we're connecting properly
      // Convert legacy type_id to type_name by using proper types
      const nodeDataWithTypes = nodeData as any
      if ('type_id' in nodeDataWithTypes && !nodeDataWithTypes.type_name) {
        nodeDataWithTypes.type_name = nodeDataWithTypes.type_id
      }
      delete (nodeData as any).type_id
      delete (nodeData as any).type_name
      delete (nodeData as any).selected

      // Remove fields we're handling with connect
      if ('chart_id' in nodeData) delete (nodeData as any).chart_id

      return await prisma.flow_node.create({ data: nodeData })

    case FlowMutationType.UPDATE:
      if (!key) throw new BadRequestException('Key is required for UPDATE')
      if (!value) throw new BadRequestException('Value is required for UPDATE')

      // Verify node belongs to a chart owned by this tenant
      const nodeToUpdate = await prisma.flow_node.findUnique({
        where: { id: key },
        include: {
          chart: true
        }
      })

      if (!nodeToUpdate) {
        throw new NotFoundException(`Flow node with ID ${key} not found`)
      }

      if (nodeToUpdate.chart.tenant_id !== tenantId) {
        throw new NotFoundException(`Flow node with ID ${key} not found`)
      }

      return await prisma.flow_node.update({
        where: { id: key },
        data: value
      })

    case FlowMutationType.REMOVE:
      if (!key) throw new BadRequestException('Key is required for REMOVE')

      // Verify node belongs to a chart owned by this tenant
      const nodeToDelete = await prisma.flow_node.findUnique({
        where: { id: key },
        include: {
          chart: true
        }
      })

      if (!nodeToDelete) {
        throw new NotFoundException(`Flow node with ID ${key} not found`)
      }

      if (nodeToDelete.chart.tenant_id !== tenantId) {
        throw new NotFoundException(`Flow node with ID ${key} not found`)
      }

      return await prisma.flow_node.delete({
        where: { id: key }
      })

    default:
      throw new BadRequestException(`Unknown mutation type: ${type}`)
  }
}

/**
 * Process flow edge mutations
 */
async function processFlowEdgeMutation(
  prisma: PrismaService,
  type: FlowMutationType,
  tenantId: number,
  key?: string,
  value?: Record<string, any>
) {
  switch (type) {
    case FlowMutationType.INSERT:
      if (!value) throw new BadRequestException('Value is required for INSERT')
      if (!value.chart_id) throw new BadRequestException('chart_id is required for flow edge')

      // Verify chart belongs to tenant
      const chart = await prisma.flow_chart.findFirst({
        where: {
          id: value.chart_id,
          tenant_id: tenantId
        }
      })

      if (!chart) {
        throw new NotFoundException(`Flow chart with ID ${value.chart_id} not found`)
      }

      // Type the data properly for flow_edge
      const edgeData: Prisma.flow_edgeCreateInput = {
        chart: { connect: { id: value.chart_id } },
        source_node_id: value.source_node_id,
        target_node_id: value.target_node_id,
        label: value.label || '',
        source_handle: value.source_handle || '',
        target_handle: value.target_handle || '',
        type: value.type || 'default',
        animated: value.animated || false,
        style: value.style || {},
        data: value.data || {},
        marker_end: value.marker_end || {},
        tenant: { connect: { id: tenantId } },
        selected: value.selected !== undefined ? value.selected : false,
        ...value
      }

      // Remove fields we're handling with connect
      if ('source_node_id' in edgeData) delete (edgeData as any).source_node_id
      if ('target_node_id' in edgeData) delete (edgeData as any).target_node_id

      return await prisma.flow_edge.create({ data: edgeData })

    case FlowMutationType.UPDATE:
      if (!key) throw new BadRequestException('Key is required for UPDATE')
      if (!value) throw new BadRequestException('Value is required for UPDATE')

      // Verify edge belongs to a chart owned by this tenant
      const edgeToUpdate = await prisma.flow_edge.findUnique({
        where: { id: key },
        include: {
          chart: true
        }
      })

      if (!edgeToUpdate) {
        throw new NotFoundException(`Flow edge with ID ${key} not found`)
      }

      if (edgeToUpdate.chart.tenant_id !== tenantId) {
        throw new NotFoundException(`Flow edge with ID ${key} not found`)
      }

      return await prisma.flow_edge.update({
        where: { id: key },
        data: value
      })

    case FlowMutationType.REMOVE:
      if (!key) throw new BadRequestException('Key is required for REMOVE')

      // Verify edge belongs to a chart owned by this tenant
      const edgeToDelete = await prisma.flow_edge.findUnique({
        where: { id: key },
        include: {
          chart: true
        }
      })

      if (!edgeToDelete) {
        throw new NotFoundException(`Flow edge with ID ${key} not found`)
      }

      if (edgeToDelete.chart.tenant_id !== tenantId) {
        throw new NotFoundException(`Flow edge with ID ${key} not found`)
      }

      return await prisma.flow_edge.delete({
        where: { id: key }
      })

    default:
      throw new BadRequestException(`Unknown mutation type: ${type}`)
  }
}

/**
 * Process flow node type mutations
 */
async function processFlowNodeTypeMutation(
  prisma: PrismaService,
  type: FlowMutationType,
  tenantId: number,
  key?: string,
  value?: Record<string, any>
) {
  switch (type) {
    case FlowMutationType.INSERT:
      if (!value) throw new BadRequestException('Value is required for INSERT')

      // Type the data properly for flow_node_type
      const nodeTypeData: Prisma.flow_node_typeCreateInput = {
        name: value.name || 'Untitled Type',
        label: value.label || value.name || 'Untitled Type',
        tenant: { connect: { id: tenantId } },
        ...value
      }

      // Remove tenant_id from input if present as we're using proper relation
      if ('tenant_id' in nodeTypeData) {
        delete (nodeTypeData as any).tenant_id
      }

      return await prisma.flow_node_type.create({ data: nodeTypeData })

    case FlowMutationType.UPDATE:
      if (!key) throw new BadRequestException('Key is required for UPDATE')
      if (!value) throw new BadRequestException('Value is required for UPDATE')

      // Verify node type belongs to tenant - direct tenant relationship check
      const existingNodeType = await prisma.flow_node_type.findFirst({
        where: {
          id: key,
          tenant_id: tenantId
        }
      })

      if (!existingNodeType) {
        // As a fallback for system node types that might be shared across tenants
        const possibleSystemType = await prisma.flow_node_type.findUnique({
          where: { id: key }
        })

        if (!possibleSystemType || !possibleSystemType.name.startsWith('system:')) {
          throw new NotFoundException(`Flow node type with ID ${key} not found`)
        }
      }

      if (!existingNodeType) {
        throw new NotFoundException(`Flow node type with ID ${key} not found`)
      }

      return await prisma.flow_node_type.update({
        where: { id: key },
        data: value
      })

    case FlowMutationType.REMOVE:
      if (!key) throw new BadRequestException('Key is required for REMOVE')

      // Verify node type belongs to tenant
      // Since flow_node_type doesn't have a direct tenant relation in the schema,
      // we'll need to check ownership through usage in flow charts
      const nodeTypeToDelete = await prisma.flow_node_type.findUnique({
        where: { id: key }
      })

      // Verify this node type is used by this tenant
      if (nodeTypeToDelete) {
        const nodeTypeUsage = await prisma.flow_node.findFirst({
          where: {
            type_name: key,
            chart: {
              tenant_id: tenantId
            }
          }
        })

        // If no nodes for this tenant use this type and it's not a system type, deny access
        if (!nodeTypeUsage && !nodeTypeToDelete.name.startsWith('system:')) {
          throw new NotFoundException(`Flow node type with ID ${key} not found`)
        }
      } else {
        throw new NotFoundException(`Flow node type with ID ${key} not found`)
      }

      if (!nodeTypeToDelete) {
        throw new NotFoundException(`Flow node type with ID ${key} not found`)
      }

      // Check if there are nodes using this type
      const nodesUsingType = await prisma.flow_node.count({
        where: { type_name: key }
      })

      if (nodesUsingType > 0) {
        throw new BadRequestException(
          `Cannot delete node type: ${nodesUsingType} nodes are using this type`
        )
      }

      return await prisma.flow_node_type.delete({
        where: { id: key }
      })

    default:
      throw new BadRequestException(`Unknown mutation type: ${type}`)
  }
}
