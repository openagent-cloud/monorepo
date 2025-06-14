import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { ApiKeyStrategy } from './api-key.strategy'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { user_role, module } from '@prisma/client'

describe('ApiKeyStrategy', () => {
  let strategy: ApiKeyStrategy
  let prismaService: PrismaService

  // Mock HTTP request object
  const mockRequest = (apiKey?: string) => ({
    headers: {
      authorization: apiKey ? `ApiKey ${apiKey}` : undefined
    }
  })

  // Mock tenant data
  const mockTenant = {
    id: 123,
    name: 'Test Tenant',
    api_key: 'valid-api-key',
    created_at: new Date(),
    updated_at: new Date(),
    uuid: 'test-uuid-123',
    modules: [module.content, module.ai_agent]
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyStrategy,
        {
          provide: PrismaService,
          useValue: {
            tenant: {
              findUnique: jest.fn()
            }
          }
        }
      ]
    }).compile()

    strategy = module.get<ApiKeyStrategy>(ApiKeyStrategy)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  it('should throw UnauthorizedException when no authorization header is present', async () => {
    const req = mockRequest()
    
    await expect(strategy.validate(req)).rejects.toThrow(UnauthorizedException)
    await expect(strategy.validate(req)).rejects.toThrow('API key is missing or invalid format')
  })

  it('should throw UnauthorizedException when authorization header has invalid format', async () => {
    const req = {
      headers: {
        authorization: 'Bearer token' // Wrong format, should be 'ApiKey token'
      }
    }
    
    await expect(strategy.validate(req)).rejects.toThrow(UnauthorizedException)
    await expect(strategy.validate(req)).rejects.toThrow('API key is missing or invalid format')
  })

  it('should throw UnauthorizedException when API key is not found in database', async () => {
    const req = mockRequest('invalid-api-key')
    
    // Mock prisma response for invalid API key
    jest.spyOn(prismaService.tenant, 'findUnique').mockResolvedValue(null)
    
    await expect(strategy.validate(req)).rejects.toThrow(UnauthorizedException)
    await expect(strategy.validate(req)).rejects.toThrow('Invalid API key')
    
    expect(prismaService.tenant.findUnique).toHaveBeenCalledWith({
      where: { api_key: 'invalid-api-key' },
      select: { id: true, modules: true }
    })
  })

  it('should return a valid user object when API key is valid', async () => {
    const validApiKey = 'valid-api-key'
    const req = mockRequest(validApiKey)
    
    // Mock prisma response for valid API key
    jest.spyOn(prismaService.tenant, 'findUnique').mockResolvedValue(mockTenant)
    
    const result = await strategy.validate(req)
    
    expect(result).toEqual({
      id: 0, // API key users get id 0
      role: user_role.admin, // API key users get admin role
      tenant: {
        id: mockTenant.id,
        modules: mockTenant.modules
      },
      modules: mockTenant.modules
    })
    
    expect(prismaService.tenant.findUnique).toHaveBeenCalledWith({
      where: { api_key: validApiKey },
      select: { id: true, modules: true }
    })
  })

  it('should handle errors during validation', async () => {
    const req = mockRequest('error-causing-key')
    
    // Mock prisma to throw an error
    jest.spyOn(prismaService.tenant, 'findUnique').mockRejectedValue(new Error('Database error'))
    
    await expect(strategy.validate(req)).rejects.toThrow(UnauthorizedException)
  })
})
