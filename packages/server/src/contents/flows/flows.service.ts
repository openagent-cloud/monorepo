import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { v4 as uuidv4 } from 'uuid'
import { FlowMutationDto } from './dto/flow-mutation.dto'
import { processFlowMutation } from './processors/flow-mutations'

@Injectable()
export class FlowService {
  constructor(private prisma: PrismaService) {}

  // Tenant ID is now injected by TenantAuthGuard and retrieved via @GetTenant() decorator

  /**
   * Get all flow charts for a tenant with summary data
   */
  async getFlowsForTenant(tenantId: number) {
    return this.prisma.flow_chart.findMany({
      where: { tenant_id: tenantId },
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            nodes: true,
            edges: true
          }
        }
      },
      orderBy: { updated_at: 'desc' }
    })
  }

  /**
   * Get a flow chart by ID with all related data
   */
  async getFlowByIdForTenant(id: string, tenantId: number) {
    const flowChart = await this.prisma.flow_chart.findFirst({
      where: { id, tenant_id: tenantId },
      include: {
        nodes: {
          include: {
            type: true
          }
        },
        edges: true
      }
    })

    if (!flowChart) {
      throw new NotFoundException(`Flow chart with ID ${id} not found`)
    }

    return flowChart
  }

  /**
   * Create a new flow chart
   */
  async createFlow(tenantId: number, flowData: any) {
    if (!flowData.name) {
      throw new BadRequestException('Flow chart name is required')
    }

    // Create the flow chart
    const flowChart = await this.prisma.flow_chart.create({
      data: {
        tenant_id: tenantId,
        name: flowData.name
      }
    })

    // If nodes were provided, create them
    if (flowData.nodes && Array.isArray(flowData.nodes)) {
      for (const node of flowData.nodes) {
        await this.prisma.flow_node.create({
          data: {
            chart_id: flowChart.id,
            tenant_id: tenantId,
            label: node.label || '',
            type_name: node.type_id || node.type_name, // Support both for backward compatibility
            position: node.position || { x: 0, y: 0 },
            data: {
              ...(node.data || {}),
              selected: node.selected !== undefined ? node.selected : false
            }
          }
        })
      }
    }

    // If edges were provided, create them
    if (flowData.edges && Array.isArray(flowData.edges)) {
      for (const edge of flowData.edges) {
        await this.prisma.flow_edge.create({
          data: {
            chart_id: flowChart.id,
            tenant_id: tenantId,
            source_node_id: edge.source_node_id,
            target_node_id: edge.target_node_id,
            source_handle: edge.source_handle,
            target_handle: edge.target_handle,
            label: edge.label
          }
        })
      }
    }

    return this.getFlowByIdForTenant(flowChart.id, tenantId)
  }

  /**
   * Process a batch of mutations at once
   */
  async processMutations(mutations: FlowMutationDto[], tenantId: number) {
    const txid = uuidv4()
    const results: Array<any> = [] // Using any type since results can be different model types

    // Using transaction for atomic operations
    await this.prisma.$transaction(async (tx) => {
      for (const mutation of mutations) {
        try {
          const result = await processFlowMutation(
            tx as unknown as PrismaService, // Cast to use in the processor
            mutation.type,
            mutation.collection,
            tenantId,
            mutation.key,
            mutation.value
          )
          // Convert any BigInt, Date etc to string for serialization
          const safeResult = JSON.parse(
            JSON.stringify(result, (_, value) =>
              typeof value === 'bigint' ? value.toString() : value
            )
          )

          results.push(safeResult)
        } catch (error) {
          // Add error to results and continue processing
          results.push({
            error: true,
            collection: mutation.collection,
            type: mutation.type,
            key: mutation.key,
            message: error.message
          })
        }
      }
    })

    return { success: true, txid, results }
  }

  /**
   * Update an existing flow chart
   */
  async updateFlow(tenantId: number, id: string, flowData: any) {
    // Verify chart exists and belongs to tenant
    const existingChart = await this.prisma.flow_chart.findFirst({
      where: { id, tenant_id: tenantId }
    })

    if (!existingChart) {
      throw new NotFoundException(`Flow chart with ID ${id} not found`)
    }

    // Update the flow chart
    const updated = await this.prisma.flow_chart.update({
      where: { id },
      data: {
        name: flowData.name || existingChart.name,
        updated_at: new Date()
      }
    })

    return updated
  }

  /**
   * Delete a flow chart and all its nodes and edges
   * (will cascade delete due to schema configuration)
   */
  async deleteFlow(tenantId: number, id: string) {
    // Verify chart exists and belongs to tenant
    const existingChart = await this.prisma.flow_chart.findFirst({
      where: { id, tenant_id: tenantId }
    })

    if (!existingChart) {
      throw new NotFoundException(`Flow chart with ID ${id} not found`)
    }

    // Delete the flow chart (nodes and edges will cascade delete)
    return this.prisma.flow_chart.delete({
      where: { id }
    })
  }

  /**
   * Batch update nodes and edges for a flow chart
   */
  async batchUpdateFlow(
    tenantId: number,
    chartId: string,
    updates: {
      nodes?: { create?: any[]; update?: any[]; delete?: string[] }
      edges?: { create?: any[]; update?: any[]; delete?: string[] }
    }
  ) {
    // Verify chart exists and belongs to tenant
    const chart = await this.prisma.flow_chart.findFirst({
      where: { id: chartId, tenant_id: tenantId }
    })

    if (!chart) {
      throw new NotFoundException(`Flow chart with ID ${chartId} not found`)
    }

    // Process all updates in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const results: {
        nodes: { created: any[]; updated: any[]; deleted: string[] }
        edges: { created: any[]; updated: any[]; deleted: string[] }
      } = {
        nodes: { created: [], updated: [], deleted: [] },
        edges: { created: [], updated: [], deleted: [] }
      }

      // Process node operations
      if (updates.nodes) {
        // Create new nodes

        // Update existing nodes
        if (updates.nodes.update && Array.isArray(updates.nodes.update)) {
          for (const node of updates.nodes.update) {
            if (!node.id) continue

            // Verify node belongs to this chart
            const existingNode = await tx.flow_node.findFirst({
              where: { id: node.id, chart_id: chartId }
            })

            if (!existingNode) continue

            const updated = await tx.flow_node.update({
              where: { id: node.id },
              data: {
                label: node.label !== undefined ? node.label : existingNode.label,
                position: node.position || existingNode.position,
                data:
                  node.selected !== undefined
                    ? { ...(node.data || existingNode.data || {}), selected: node.selected }
                    : node.data || existingNode.data,
                type_name: node.type_id || node.type_name || existingNode.type_name
              }
            })

            results.nodes.updated.push(updated)
          }
        }

        // Delete nodes
        if (updates.nodes.delete && Array.isArray(updates.nodes.delete)) {
          for (const nodeId of updates.nodes.delete) {
            // Verify node belongs to this chart
            const existingNode = await tx.flow_node.findFirst({
              where: { id: nodeId, chart_id: chartId }
            })

            if (!existingNode) continue

            await tx.flow_node.delete({ where: { id: nodeId } })
            results.nodes.deleted.push(nodeId)
          }
        }
      }

      // Process edge operations
      if (updates.edges) {
        // Create new edges
        if (updates.edges.create && Array.isArray(updates.edges.create)) {
          for (const edge of updates.edges.create) {
            const created = await tx.flow_edge.create({
              data: {
                chart_id: chartId,
                tenant_id: tenantId,
                source_node_id: edge.source_node_id,
                target_node_id: edge.target_node_id,
                source_handle: edge.source_handle,
                target_handle: edge.target_handle,
                label: edge.label
              }
            })
            results.edges.created.push(created)
          }
        }

        // Update existing edges
        if (updates.edges.update && Array.isArray(updates.edges.update)) {
          for (const edge of updates.edges.update) {
            if (!edge.id) continue

            // Verify edge belongs to this chart
            const existingEdge = await tx.flow_edge.findFirst({
              where: { id: edge.id, chart_id: chartId }
            })

            if (!existingEdge) continue

            const updated = await tx.flow_edge.update({
              where: { id: edge.id },
              data: {
                source_node_id: edge.source_node_id || existingEdge.source_node_id,
                target_node_id: edge.target_node_id || existingEdge.target_node_id,
                source_handle: edge.source_handle,
                target_handle: edge.target_handle,
                label: edge.label
              }
            })

            results.edges.updated.push(updated)
          }
        }

        // Delete edges
        if (updates.edges.delete && Array.isArray(updates.edges.delete)) {
          for (const edgeId of updates.edges.delete) {
            // Verify edge belongs to this chart
            const existingEdge = await tx.flow_edge.findFirst({
              where: { id: edgeId, chart_id: chartId }
            })

            if (!existingEdge) continue

            await tx.flow_edge.delete({ where: { id: edgeId } })
            results.edges.deleted.push(edgeId)
          }
        }
      }

      // Update flow chart updated_at timestamp
      await tx.flow_chart.update({
        where: { id: chartId },
        data: { updated_at: new Date() }
      })

      return results
    })

    return result
  }
}
