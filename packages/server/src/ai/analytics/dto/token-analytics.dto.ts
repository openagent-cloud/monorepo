import { ApiProperty } from '@nestjs/swagger'
import {
  TokenAnalytics,
  TokenUsageByDay,
  TokenUsageByModel,
  ServiceTokenUsage,
  TokenAnalyticsSummary
} from '../analytics.types'

/**
 * DTO for token usage analytics by model
 */
export class TokenUsageByModelDto implements TokenUsageByModel {
  @ApiProperty({
    description: 'Model name',
    example: 'gpt-4',
    type: String
  })
  model: string

  @ApiProperty({
    description: 'Prompt/input tokens used',
    example: 12500,
    type: Number
  })
  promptTokens: number

  @ApiProperty({
    description: 'Completion/output tokens used',
    example: 8750,
    type: Number
  })
  completionTokens: number

  @ApiProperty({
    description: 'Total tokens used (prompt + completion)',
    example: 21250,
    type: Number
  })
  totalTokens: number

  @ApiProperty({
    description: 'Number of requests made with this model',
    example: 150,
    type: Number
  })
  requestCount: number
}

/**
 * DTO for token usage analytics by day
 */
export class TokenUsageByDayDto implements TokenUsageByDay {
  @ApiProperty({
    description: 'Date in ISO format',
    example: '2025-05-18',
    type: String
  })
  date: string

  @ApiProperty({
    description: 'Prompt/input tokens used on this day',
    example: 5000,
    type: Number
  })
  promptTokens: number

  @ApiProperty({
    description: 'Completion/output tokens used on this day',
    example: 3500,
    type: Number
  })
  completionTokens: number

  @ApiProperty({
    description: 'Total tokens used on this day (prompt + completion)',
    example: 8500,
    type: Number
  })
  totalTokens: number

  @ApiProperty({
    description: 'Number of requests made on this day',
    example: 45,
    type: Number
  })
  requestCount: number
}

/**
 * DTO for token usage analytics by service
 */
export class ServiceTokenUsageDto implements ServiceTokenUsage {
  @ApiProperty({
    description: 'Prompt/input tokens used for this service',
    example: 15000,
    type: Number
  })
  promptTokens: number

  @ApiProperty({
    description: 'Completion/output tokens used for this service',
    example: 10500,
    type: Number
  })
  completionTokens: number

  @ApiProperty({
    description: 'Total tokens used for this service (prompt + completion)',
    example: 25500,
    type: Number
  })
  totalTokens: number

  @ApiProperty({
    description: 'Number of requests made with this service',
    example: 200,
    type: Number
  })
  requestCount: number

  @ApiProperty({
    description: 'Models used with this service',
    example: ['gpt-4', 'gpt-3.5-turbo'],
    type: [String],
    isArray: true
  })
  models: string[]
}

/**
 * DTO for token analytics summary
 */
export class TokenAnalyticsSummaryDto implements TokenAnalyticsSummary {
  @ApiProperty({
    description: 'Total tokens used across all services',
    example: 42500,
    type: Number
  })
  totalTokens: number

  @ApiProperty({
    description: 'Total prompt/input tokens used across all services',
    example: 25000,
    type: Number
  })
  promptTokens: number

  @ApiProperty({
    description: 'Total completion/output tokens used across all services',
    example: 17500,
    type: Number
  })
  completionTokens: number

  @ApiProperty({
    description: 'Total estimated cost in USD across all services',
    example: 0.85,
    type: Number
  })
  estimatedCost: number

  @ApiProperty({
    description: 'Timeframe of the analytics data',
    type: 'object',
    example: {
      startDate: '2025-04-18T00:00:00.000Z',
      endDate: '2025-05-18T23:59:59.999Z',
      days: 30
    }
  })
  timeframe: {
    startDate: Date
    endDate: Date
    days: number
  }
}

/**
 * DTO for complete token analytics response
 */
export class TokenAnalyticsDto implements TokenAnalytics {
  @ApiProperty({
    description: 'Summary of token usage analytics',
    type: TokenAnalyticsSummaryDto
  })
  summary: TokenAnalyticsSummaryDto

  @ApiProperty({
    description: 'Token usage breakdown by model',
    type: [TokenUsageByModelDto],
    isArray: true
  })
  byModel: TokenUsageByModelDto[]

  @ApiProperty({
    description: 'Token usage breakdown by day',
    type: [TokenUsageByDayDto],
    isArray: true
  })
  byDay: TokenUsageByDayDto[]

  @ApiProperty({
    description: 'Token usage breakdown by service',
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/ServiceTokenUsageDto'
    },
    example: {
      openai: {
        promptTokens: 15000,
        completionTokens: 10500,
        totalTokens: 25500,
        requestCount: 200,
        models: ['gpt-4', 'gpt-3.5-turbo']
      },
      anthropic: {
        promptTokens: 10000,
        completionTokens: 7000,
        totalTokens: 17000,
        requestCount: 150,
        models: ['claude-3-opus', 'claude-3-sonnet']
      }
    }
  })
  byService: Record<string, ServiceTokenUsageDto>
}
