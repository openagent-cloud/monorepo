/**
 * Token usage statistics by model
 */
export interface TokenUsageByModel {
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  requestCount: number
}

/**
 * Token usage statistics by day
 */
export interface TokenUsageByDay {
  date: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  requestCount: number
}

/**
 * Service token usage statistics
 */
export interface ServiceTokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  requestCount: number
  models: string[]
}

/**
 * Token analytics summary
 */
export interface TokenAnalyticsSummary {
  totalTokens: number
  promptTokens: number
  completionTokens: number
  estimatedCost: number
  timeframe: {
    startDate: Date
    endDate: Date
    days: number
  }
}

/**
 * Comprehensive token analytics
 */
export interface TokenAnalytics {
  summary: TokenAnalyticsSummary
  byModel: TokenUsageByModel[]
  byDay: TokenUsageByDay[]
  byService: Record<string, ServiceTokenUsage>
}
