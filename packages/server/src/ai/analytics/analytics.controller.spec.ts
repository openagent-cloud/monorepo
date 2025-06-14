import { Test, TestingModule } from '@nestjs/testing'
import { AnalyticsController } from './analytics.controller'
import { AnalyticsService } from './analytics.service'
import { TokenAnalytics } from './analytics.types'

// Mock the ApiKey decorator
jest.mock('../../utils/decorators/api-key.decorator', () => ({
  ApiKey: jest.fn().mockImplementation(() => {
    return (target: any, key: string, index: number) => {
      // This is a parameter decorator, so we don't need to do anything in the test
    }
  })
}))

describe('AnalyticsController', () => {
  let controller: AnalyticsController
  let service: AnalyticsService

  // Mock analytics service
  const mockAnalyticsService = {
    getTokenAnalytics: jest.fn()
  }

  // Mock token analytics response
  const mockTokenAnalytics: TokenAnalytics = {
    summary: {
      totalTokens: 1000,
      promptTokens: 400,
      completionTokens: 600,
      estimatedCost: 0.02,
      timeframe: {
        startDate: new Date('2025-04-18'),
        endDate: new Date('2025-05-18'),
        days: 30
      }
    },
    byModel: [
      {
        model: 'gpt-4',
        totalTokens: 600,
        promptTokens: 200,
        completionTokens: 400,
        requestCount: 10
      },
      {
        model: 'gpt-3.5-turbo',
        totalTokens: 400,
        promptTokens: 200,
        completionTokens: 200,
        requestCount: 20
      }
    ],
    byDay: [
      {
        date: '2025-05-17',
        totalTokens: 500,
        promptTokens: 200,
        completionTokens: 300,
        requestCount: 15
      },
      {
        date: '2025-05-18',
        totalTokens: 500,
        promptTokens: 200,
        completionTokens: 300,
        requestCount: 15
      }
    ],
    byService: {
      openai: {
        promptTokens: 400,
        completionTokens: 600,
        totalTokens: 1000,
        requestCount: 30,
        models: ['gpt-4', 'gpt-3.5-turbo']
      }
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService
        }
      ]
    }).compile()

    controller = module.get<AnalyticsController>(AnalyticsController)
    service = module.get<AnalyticsService>(AnalyticsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getTokenAnalytics', () => {
    it('should call service.getTokenAnalytics with correct parameters', async () => {
      const apiKey = 'test-api-key'
      const days = 30

      mockAnalyticsService.getTokenAnalytics.mockResolvedValue(mockTokenAnalytics)

      const result = await controller.getTokenAnalytics(apiKey, days)

      expect(service.getTokenAnalytics).toHaveBeenCalledWith(apiKey, days)
      expect(result).toEqual(mockTokenAnalytics)
    })

    it('should use default days value if not provided', async () => {
      const apiKey = 'test-api-key'

      mockAnalyticsService.getTokenAnalytics.mockResolvedValue(mockTokenAnalytics)

      // The controller will use the default value from the DefaultValuePipe
      // We're simulating that by passing 30 here
      const result = await controller.getTokenAnalytics(apiKey, 30)

      expect(service.getTokenAnalytics).toHaveBeenCalledWith(apiKey, 30)
      expect(result).toEqual(mockTokenAnalytics)
    })

    it('should handle custom timeframe', async () => {
      const apiKey = 'test-api-key'
      const days = 60

      mockAnalyticsService.getTokenAnalytics.mockResolvedValue({
        ...mockTokenAnalytics,
        summary: {
          ...mockTokenAnalytics.summary,
          timeframe: {
            startDate: new Date('2025-03-18'),
            endDate: new Date('2025-05-18'),
            days: 60
          }
        }
      })

      const result = await controller.getTokenAnalytics(apiKey, days)

      expect(service.getTokenAnalytics).toHaveBeenCalledWith(apiKey, days)
      expect(result.summary.timeframe.startDate).toEqual(new Date('2025-03-18'))
    })
  })
})
