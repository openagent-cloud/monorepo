import { Test, TestingModule } from '@nestjs/testing'
import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '../../utils/config/config.service'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { TokenService, TokenType } from '../services/token.service'
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy
  let tokenService: TokenService
  let prismaService: PrismaService
  let configService: ConfigService

  // Mock user for testing
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    role: 'user',
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.png',
    tenant_id: 123
  }

  // Mock payload for testing
  const mockValidPayload = {
    sub: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    type: TokenType.ACCESS,
    tenant_id: 123,
    jti: 'test-jwt-id',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            jwtSecret: 'test-secret',
            jwtIssuer: 'test-issuer',
            jwtAudience: 'test-audience',
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret'
              if (key === 'JWT_ISSUER') return 'test-issuer'
              if (key === 'JWT_AUDIENCE') return 'test-audience'
              return undefined
            })
          }
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockImplementation(({ where }) => {
                if (where.id === mockUser.id) {
                  return Promise.resolve(mockUser)
                }
                return Promise.resolve(null)
              })
            }
          }
        },
        {
          provide: TokenService,
          useValue: {
            isTokenRevoked: jest.fn().mockImplementation((jti) => Promise.resolve(false))
          }
        },
        JwtStrategy
      ]
    }).compile()

    strategy = module.get<JwtStrategy>(JwtStrategy)
    tokenService = module.get<TokenService>(TokenService)
    prismaService = module.get<PrismaService>(PrismaService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should throw error when JWT_SECRET is not configured', async () => {
    // Create a new test module with a ConfigService that has no JWT_SECRET
    const moduleNoSecret = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            jwtSecret: undefined,
            jwtIssuer: 'test-issuer',
            jwtAudience: 'test-audience',
            get: jest.fn().mockReturnValue(undefined)
          }
        },
        {
          provide: PrismaService,
          useValue: { user: { findUnique: jest.fn() } }
        },
        {
          provide: TokenService,
          useValue: { isTokenRevoked: jest.fn() }
        },
      ]
    }).compile()
    
    // The JwtStrategy should throw during instantiation
    expect(() => {
      const configWithNoSecret = moduleNoSecret.get<ConfigService>(ConfigService)
      const prisma = moduleNoSecret.get<PrismaService>(PrismaService)
      const tokenSvc = moduleNoSecret.get<TokenService>(TokenService)
      
      // This should throw because of missing JWT_SECRET
      new JwtStrategy(configWithNoSecret, prisma, tokenSvc)
    }).toThrow(InternalServerErrorException)
  })

  describe('validate', () => {
    it('should validate a user with valid token', async () => {
      const result = await strategy.validate(mockValidPayload)
      
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        tenant_id: mockUser.tenant_id
      })
      
      expect(tokenService.isTokenRevoked).toHaveBeenCalledWith(mockValidPayload.jti)
      expect(prismaService.user.findUnique).toHaveBeenCalled()
    })

    it('should throw UnauthorizedException for incorrect token type', async () => {
      const invalidPayload = {
        ...mockValidPayload,
        type: TokenType.REFRESH // Wrong token type
      }
      
      await expect(strategy.validate(invalidPayload)).rejects.toThrow(UnauthorizedException)
      expect(tokenService.isTokenRevoked).not.toHaveBeenCalled()
      expect(prismaService.user.findUnique).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException for revoked token', async () => {
      // Setup the mock to return true (token is revoked)
      jest.spyOn(tokenService, 'isTokenRevoked').mockResolvedValueOnce(true)
      
      await expect(strategy.validate(mockValidPayload)).rejects.toThrow(UnauthorizedException)
      expect(tokenService.isTokenRevoked).toHaveBeenCalledWith(mockValidPayload.jti)
      expect(prismaService.user.findUnique).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedException for non-existent user', async () => {
      const payloadWithInvalidUser = {
        ...mockValidPayload,
        sub: 999 // Non-existent user ID
      }
      
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null)
      
      await expect(strategy.validate(payloadWithInvalidUser)).rejects.toThrow(UnauthorizedException)
      expect(tokenService.isTokenRevoked).toHaveBeenCalledWith(payloadWithInvalidUser.jti)
      expect(prismaService.user.findUnique).toHaveBeenCalled()
    })

    it('should throw UnauthorizedException for tenant mismatch', async () => {
      const payloadWithWrongTenant = {
        ...mockValidPayload,
        tenant_id: 456 // Different tenant than user's tenant (123)
      }
      
      await expect(strategy.validate(payloadWithWrongTenant)).rejects.toThrow(UnauthorizedException)
      expect(tokenService.isTokenRevoked).toHaveBeenCalledWith(payloadWithWrongTenant.jti)
      expect(prismaService.user.findUnique).toHaveBeenCalled()
    })
  })
})
