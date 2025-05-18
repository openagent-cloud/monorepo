import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TokenUsageByDay, TokenUsageByModel, TokenAnalytics } from '../types/analytics.types'
import { AdapterType } from '@prisma/client'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Get detailed token usage analytics for a tenant
   * @param apiKey The tenant's API key
   * @param days Number of days to analyze (default: 30)
   * @returns Detailed token usage analytics
   */
  async getTokenAnalytics(apiKey: string, days = 30): Promise<TokenAnalytics> {
    // Find the tenant
    const tenant = await this.prisma.tenant.findUnique({ where: { apiKey } })
    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    // Calculate the date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all proxy requests for this tenant within the date range
    const requests = await this.prisma.proxyRequest.findMany({
      where: {
        tenantId: tenant.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // Calculate overall token usage
    const totalTokens = requests.reduce((sum, r) => sum + (r.totalTokens || 0), 0)
    const promptTokens = requests.reduce((sum, r) => sum + (r.promptTokens || 0), 0)
    const completionTokens = requests.reduce((sum, r) => sum + (r.completionTokens || 0), 0)

    // Calculate token usage by model
    const modelUsage = this.calculateTokenUsageByModel(requests)

    // Calculate token usage by day
    const dailyUsage = this.calculateTokenUsageByDay(requests, startDate, endDate)

    // Calculate token usage by service
    const serviceUsage = this.calculateTokenUsageByService(requests)

    // Calculate cost estimates (if pricing data is available)
    const costEstimate = this.calculateCostEstimate(requests)

    return {
      summary: {
        totalTokens,
        promptTokens,
        completionTokens,
        estimatedCost: costEstimate,
        timeframe: {
          startDate,
          endDate,
          days,
        },
      },
      byModel: modelUsage,
      byDay: dailyUsage,
      byService: serviceUsage,
    }
  }

  /**
   * Calculate token usage by model
   * @param requests Array of proxy requests
   * @returns Token usage by model
   */
  private calculateTokenUsageByModel(requests: any[]): TokenUsageByModel[] {
    const modelMap = new Map<string, {
      promptTokens: number,
      completionTokens: number,
      totalTokens: number,
      requestCount: number
    }>()

    requests.forEach(request => {
      if (!request.model) return

      const model = request.model
      const current = modelMap.get(model) || {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        requestCount: 0
      }

      modelMap.set(model, {
        promptTokens: current.promptTokens + (request.promptTokens || 0),
        completionTokens: current.completionTokens + (request.completionTokens || 0),
        totalTokens: current.totalTokens + (request.totalTokens || 0),
        requestCount: current.requestCount + 1
      })
    })

    return Array.from(modelMap.entries()).map(([model, usage]) => ({
      model,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
      requestCount: usage.requestCount,
    }))
  }

  /**
   * Calculate token usage by day
   * @param requests Array of proxy requests
   * @param startDate Start date for the analysis
   * @param endDate End date for the analysis
   * @returns Token usage by day
   */
  private calculateTokenUsageByDay(
    requests: any[],
    startDate: Date,
    endDate: Date
  ): TokenUsageByDay[] {
    const dailyMap = new Map<string, {
      promptTokens: number,
      completionTokens: number,
      totalTokens: number,
      requestCount: number,
      date: Date
    }>()

    // Initialize map with all days in the range
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0]
      dailyMap.set(dateKey, {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        requestCount: 0,
        date: new Date(currentDate)
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Fill in the actual data
    requests.forEach(request => {
      const dateKey = request.createdAt.toISOString().split('T')[0]
      const current = dailyMap.get(dateKey)

      if (current) {
        dailyMap.set(dateKey, {
          promptTokens: current.promptTokens + (request.promptTokens || 0),
          completionTokens: current.completionTokens + (request.completionTokens || 0),
          totalTokens: current.totalTokens + (request.totalTokens || 0),
          requestCount: current.requestCount + 1,
          date: current.date
        })
      }
    })

    return Array.from(dailyMap.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(usage => ({
        date: usage.date.toISOString().split('T')[0],
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        requestCount: usage.requestCount,
      }))
  }

  /**
   * Calculate token usage by service
   * @param requests Array of proxy requests
   * @returns Token usage by service
   */
  private calculateTokenUsageByService(requests: any[]): Record<string, any> {
    const serviceMap = new Map<string, {
      promptTokens: number,
      completionTokens: number,
      totalTokens: number,
      requestCount: number,
      models: Set<string>
    }>()

    // Initialize map with all adapter types
    Object.values(AdapterType).forEach(service => {
      serviceMap.set(service, {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        requestCount: 0,
        models: new Set()
      })
    })

    // Fill in the actual data
    requests.forEach(request => {
      const service = request.service
      const current = serviceMap.get(service)

      if (current) {
        if (request.model) {
          current.models.add(request.model)
        }

        serviceMap.set(service, {
          promptTokens: current.promptTokens + (request.promptTokens || 0),
          completionTokens: current.completionTokens + (request.completionTokens || 0),
          totalTokens: current.totalTokens + (request.totalTokens || 0),
          requestCount: current.requestCount + 1,
          models: current.models
        })
      }
    })

    // Convert to plain object
    return Object.fromEntries(
      Array.from(serviceMap.entries()).map(([service, usage]) => [
        service,
        {
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          totalTokens: usage.totalTokens,
          requestCount: usage.requestCount,
          models: Array.from(usage.models)
        }
      ])
    )
  }

  /**
   * Calculate estimated cost based on token usage
   * This is a simple implementation that can be expanded with more accurate pricing data
   * @param requests Array of proxy requests
   * @returns Estimated cost in USD
   */
  private calculateCostEstimate(requests: any[]): number {
    // Simple pricing model (can be expanded with more accurate data)
    const pricing: Record<string, { prompt: number; completion: number }> = {
      // OpenAI models (price per 1K tokens in USD)
      'gpt-4': { prompt: 0.03, completion: 0.06 },
      'gpt-4-32k': { prompt: 0.06, completion: 0.12 },
      'gpt-3.5-turbo': { prompt: 0.0015, completion: 0.002 },
      'gpt-3.5-turbo-16k': { prompt: 0.003, completion: 0.004 },
      // Anthropic models
      'claude-2': { prompt: 0.01102, completion: 0.03268 },
      'claude-instant-1': { prompt: 0.00163, completion: 0.00551 },
      // Default pricing for unknown models
      'default': { prompt: 0.002, completion: 0.002 }
    }

    let totalCost = 0

    requests.forEach(request => {
      const model = request.model || 'default'
      const pricingInfo = pricing[model] || pricing['default']

      const promptCost = ((request.promptTokens || 0) / 1000) * pricingInfo.prompt
      const completionCost = ((request.completionTokens || 0) / 1000) * pricingInfo.completion

      totalCost += promptCost + completionCost
    })

    return parseFloat(totalCost.toFixed(4))
  }
}
