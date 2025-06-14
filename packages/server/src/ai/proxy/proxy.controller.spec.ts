import { Test, TestingModule } from '@nestjs/testing'
import { ProxyController } from './proxy.controller'
import { ProxyService } from './proxy.service'
import { BadRequestException } from '@nestjs/common'
import { ProxyRequestDto } from './dto/proxy-request.dto'
import { Response } from 'express'

// Mock the ApiKey decorator
jest.mock('../../utils/decorators/api-key.decorator', () => ({
  ApiKey: jest.fn().mockImplementation(() => {
    return (target: any, key: string, index: number) => {
      // This is a parameter decorator, so we don't need to do anything in the test
    }
  })
}))

describe('ProxyController', () => {
  let controller: ProxyController
  let service: ProxyService

  // Mock proxy service
  const mockProxyService = {
    handleProxyRequest: jest.fn(),
    getUsageStats: jest.fn(),
    handleStreamingProxyRequest: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProxyController],
      providers: [
        {
          provide: ProxyService,
          useValue: mockProxyService
        }
      ]
    }).compile()

    controller = module.get<ProxyController>(ProxyController)
    service = module.get<ProxyService>(ProxyService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('proxyRequest', () => {
    it('should throw BadRequestException if no adapter is provided', async () => {
      const apiKey = 'test-api-key'
      const dto = new ProxyRequestDto()
      dto.payload = { model: 'gpt-4', messages: [{ role: 'user', content: 'Hello' }] }

      await expect(controller.proxyRequest('', apiKey, dto)).rejects.toThrow(BadRequestException)
    })

    it('should call service.handleProxyRequest with correct parameters', async () => {
      const apiKey = 'test-api-key'
      const adapter = 'openai'
      const dto = new ProxyRequestDto()
      dto.payload = {
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: 0.7
      }

      const mockResponse = {
        id: 'response-id',
        choices: [{ message: { content: 'Hello there!' } }],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 15,
          total_tokens: 25
        }
      }

      mockProxyService.handleProxyRequest.mockResolvedValue(mockResponse)

      const result = await controller.proxyRequest(adapter, apiKey, dto)

      expect(service.handleProxyRequest).toHaveBeenCalledWith(adapter, apiKey, dto.payload)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('streamProxyRequest', () => {
    it('should throw BadRequestException if no adapter is provided', async () => {
      const apiKey = 'test-api-key'
      const dto = new ProxyRequestDto()
      dto.payload = { model: 'gpt-4', messages: [{ role: 'user', content: 'Hello' }], stream: true }
      const res = { setHeader: jest.fn(), write: jest.fn(), end: jest.fn() } as unknown as Response

      await expect(controller.streamProxyRequest('', apiKey, dto, res)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should call service.handleStreamingRequest with correct parameters', async () => {
      const apiKey = 'test-api-key'
      const adapter = 'openai'
      const dto = new ProxyRequestDto()
      dto.payload = {
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: 0.7,
        stream: true
      }

      const res = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn()
      } as unknown as Response

      mockProxyService.handleStreamingProxyRequest.mockResolvedValue(undefined)

      await controller.streamProxyRequest(adapter, apiKey, dto, res)

      expect(service.handleStreamingProxyRequest).toHaveBeenCalledWith(
        adapter,
        apiKey,
        dto.payload,
        res
      )
    })
  })

  describe('getStats', () => {
    it('should call service.getUsageStats with correct parameters', async () => {
      const apiKey = 'test-api-key'
      const mockStats = {
        totalRequests: 100,
        totalTokens: 5000,
        promptTokens: 2000,
        completionTokens: 3000,
        estimatedCost: 0.1
      }

      mockProxyService.getUsageStats.mockResolvedValue(mockStats)

      const result = await controller.getStats(apiKey)

      expect(service.getUsageStats).toHaveBeenCalledWith(apiKey)
      expect(result).toEqual(mockStats)
    })
  })
})
