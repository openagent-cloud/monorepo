import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { flowChartExamples, flowNodeExamples, flowEdgeExamples, flowNodeTypeExamples } from './examples';

// Define interfaces for each model type that directly match the Prisma schema

/**
 * Matches the flow_chart model in the Prisma schema
 * @example
 * {
 *   name: "My Flow Chart",
 *   tenant_id: 1
 * }
 */
export interface FlowChartValue {
  id?: string;               // @id @default(uuid())
  name: string;              // required
  tenant_id?: number;        // automatically set from API key
  created_at?: Date;         // @default(now())
  updated_at?: Date;         // @updatedAt
}

/**
 * Matches the flow_node model in the Prisma schema
 * @example
 * {
 *   chart_id: "chart1",
 *   label: "Process Data",
 *   type_id: "node-type-1",
 *   data: { params: { input: "value" } },
 *   x: 100,
 *   y: 200
 * }
 */
export interface FlowNodeValue {
  id?: string;               // @id @default(uuid())
  chart_id: string;          // relation to flow_chart
  label: string;             // required
  type_id: string;           // relation to flow_node_type - reference by ID
  data: Record<string, any>; // Json - specific configuration matching the node type's schema
  x: number;                 // Float - position on canvas
  y: number;                 // Float - position on canvas
  created_at?: Date;         // @default(now())
  updated_at?: Date;         // @updatedAt
}

/**
 * Matches the flow_edge model in the Prisma schema
 * @example
 * {
 *   chart_id: "chart1",
 *   source_node_id: "node1",
 *   target_node_id: "node2",
 *   label: "Success"
 * }
 */
export interface FlowEdgeValue {
  id?: string;               // @id @default(uuid())
  chart_id: string;          // relation to flow_chart
  source_node_id: string;    // required
  target_node_id: string;    // required
  source_handle?: string;    // optional
  target_handle?: string;    // optional
  label?: string;            // optional
  created_at?: Date;         // @default(now())
  updated_at?: Date;         // @updatedAt
}

/**
 * Matches the flow_node_type model in the Prisma schema
 * @example
 * {
 *   name: "prompt",
 *   label: "Prompt Node",
 *   config_schema: { type: "object", properties: {} }
 * }
 */
export interface FlowNodeTypeValue {
  id?: string;                   // @id @default(uuid())
  name: string;                  // @unique - e.g., 'prompt', 'function', 'agent'
  label: string;                 // required - human-readable label
  config_schema?: Record<string, any>; // Json? - JSON Schema defining the expected structure of node.data
  created_at?: Date;             // @default(now())
  updated_at?: Date;             // @updatedAt
}

export enum FlowMutationType {
  INSERT = 'insert',
  UPDATE = 'update',
  REMOVE = 'remove', // This is the delete operation
}

export enum FlowCollection {
  FLOW_CHART = 'flow_chart',
  FLOW_NODE = 'flow_node',
  FLOW_EDGE = 'flow_edge',
  FLOW_NODE_TYPE = 'flow_node_type',
}

export class FlowMutationDto {
  @ApiProperty({
    enum: FlowMutationType,
    description: 'Type of mutation operation',
    example: FlowMutationType.INSERT
  })
  @IsEnum(FlowMutationType)
  @IsNotEmpty()
  type: FlowMutationType;

  @ApiProperty({
    enum: FlowCollection,
    description: 'Collection/model to mutate',
    example: FlowCollection.FLOW_CHART
  })
  @IsEnum(FlowCollection)
  @IsNotEmpty()
  collection: FlowCollection;

  @ApiProperty({
    description: 'ID of item for update/remove operations',
    example: 'chart_01',
    required: false
  })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({
    description: 'Data for insert/update operations',
    examples: {
      // Flow Chart Examples
      ...flowChartExamples,
      
      // Flow Node Examples
      ...flowNodeExamples,
      
      // Flow Edge Examples
      ...flowEdgeExamples,
      
      // Flow Node Type Examples
      ...flowNodeTypeExamples
    },
    required: false
  })
  @IsObject()
  @IsOptional()
  @Type(() => Object)
  value?: FlowChartValue | FlowNodeValue | FlowEdgeValue | FlowNodeTypeValue;
}
