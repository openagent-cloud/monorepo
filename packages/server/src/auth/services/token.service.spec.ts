import { Test, TestingModule } from '@nestjs/testing'
import { TokenService, TokenType } from './token.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '../../utils/config/config.service'
import { UnauthorizedException, Logger } from '@nestjs/common'
import { user } from '@prisma/client'
import { PrismaService } from '../../utils/prisma/prisma.service'

// Mock uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-value')
}))

describe('TokenService', () => {
  let service: TokenService
  let jwtService: JwtService
  let configService: ConfigService

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  }

  const mockConfigService = {
    jwtSecret: 'test-secret',
    jwtIssuer: 'test-issuer',
    jwtAudience: 'test-audience',
    isTest: true,
    get: jest.fn().mockImplementation((key) => {
      if (key === 'JWT_SECRET') return 'test-secret'
      if (key === 'JWT_ISSUER') return 'test-issuer'
      if (key === 'JWT_AUDIENCE') return 'test-audience'
      return undefined
    })
  }
  
  // Mock for PrismaService
  const mockPrismaService = {
    // We don't use any specific prisma methods in TokenService currently
  }
  
  // Define a mock PrismaService class to satisfy TypeScript
  class MockPrismaService {}

  // Jest spy on uuid function
  jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-value')
  }))

  beforeEach(async () => {
    jest.clearAllMocks()
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    service = module.get<TokenService>(TokenService)
    jwtService = module.get<JwtService>(JwtService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateAccessToken', () => {
    it('should generate an access token with 1h expiration', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        tenant_id: 1
      } as user

      mockJwtService.sign.mockReturnValue('mock-jwt-token')
      
      const result = service.generateAccessToken(mockUser)
      
      expect(result).toBe('mock-jwt-token')
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          type: TokenType.ACCESS,
          tenant_id: mockUser.tenant_id,
          jti: 'test-uuid-value' // From our mocked uuid
        },
        {
          expiresIn: '1h',  // Test our hardcoded value
          issuer: 'test-issuer',
          audience: 'test-audience'
        }
      )
    })
  })

  describe('generateRefreshToken', () => {
    it('should generate a refresh token with 7d expiration', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        tenant_id: 1
      } as user

      mockJwtService.sign.mockReturnValue('mock-refresh-token')
      
      const result = service.generateRefreshToken(mockUser)
      
      expect(result).toBe('mock-refresh-token')
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          type: TokenType.REFRESH,
          tenant_id: mockUser.tenant_id,
          jti: 'test-uuid-value' // From our mocked uuid
        },
        {
          expiresIn: '7d',  // Test our hardcoded value
          issuer: 'test-issuer',
          audience: 'test-audience'
        }
      )
    })
  })

  describe('verifyToken', () => {
    it('should return true for a valid refresh token', () => {
      const mockToken = 'valid-refresh-token'
      const mockPayload = {
        sub: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        type: TokenType.REFRESH,
        exp: Math.floor(Date.now() / 1000) + 3600
      }
      
      mockJwtService.verify.mockReturnValue(mockPayload)
      
      const result = service.isRefreshToken(mockToken)
      
      expect(result).toBe(true)
      expect(mockJwtService.verify).toHaveBeenCalled()
    })

    it('should return false if token is not a refresh token', () => {
      const mockToken = 'access-token-not-refresh'
      const mockPayload = {
        sub: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        type: TokenType.ACCESS, // Wrong type
        exp: Math.floor(Date.now() / 1000) + 3600
      }
      
      mockJwtService.verify.mockReturnValue(mockPayload)
      
      const result = service.isRefreshToken(mockToken)
      
      expect(result).toBe(false)
      expect(mockJwtService.verify).toHaveBeenCalled()
    })

    it('should return false if token verification fails', () => {
      const mockToken = 'invalid-token'
      
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })
      
      const result = service.isRefreshToken(mockToken)
      
      expect(result).toBe(false)
      expect(mockJwtService.verify).toHaveBeenCalled()
    })
  })

  describe('generateResetToken', () => {
    it('should generate a password reset token with 24h expiration', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        tenant_id: 1
      } as user

      mockJwtService.sign.mockReturnValue('mock-reset-token')
      
      const result = service.generateResetToken(mockUser)
      
      expect(result).toBe('mock-reset-token')
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          type: TokenType.RESET_PASSWORD,
          tenant_id: mockUser.tenant_id,
          jti: 'test-uuid-value' // From our mocked uuid
        },
        {
          expiresIn: '24h',  // Test our hardcoded value
          issuer: 'test-issuer',
          audience: 'test-audience'
        }
      )
    })
  })

  describe('isResetToken', () => {
    it('should return true for a valid reset token', () => {
      const mockToken = 'valid-reset-token'
      const mockPayload = {
        sub: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        type: TokenType.RESET_PASSWORD,
        exp: Math.floor(Date.now() / 1000) + 3600
      }
      
      mockJwtService.verify.mockReturnValue(mockPayload)
      
      const result = service.isResetToken(mockToken)
      
      expect(result).toBe(true)
      expect(mockJwtService.verify).toHaveBeenCalled()
    })

    it('should return false if token is not a reset token', () => {
      const mockToken = 'access-token-not-reset'
      const mockPayload = {
        sub: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        type: TokenType.ACCESS, // Wrong type
        exp: Math.floor(Date.now() / 1000) + 3600
      }
      
      mockJwtService.verify.mockReturnValue(mockPayload)
      
      const result = service.isResetToken(mockToken)
      
      expect(result).toBe(false)
      expect(mockJwtService.verify).toHaveBeenCalled()
    })
  })

  describe('Token revocation', () => {
    it('should mark a token as revoked', async () => {
      const jti = 'test-token-id';
      service.revokeToken(jti);
      
      const result = await service.isTokenRevoked(jti);
      expect(result).toBe(true);
    });
    
    it('should return false for non-revoked tokens', async () => {
      const jti = 'non-revoked-token';
      
      const result = await service.isTokenRevoked(jti);
      expect(result).toBe(false);
    });
    
    it('should clean up expired tokens', async () => {
      // Mock Date.now to return a fixed timestamp
      const now = 1623456789000; // Some timestamp
      jest.spyOn(Date, 'now').mockImplementation(() => now);
      
      // Add an expired token (1 hour ago)
      const expiredJti = 'expired-token';
      const expiredTime = Math.floor(now / 1000) - 3600;
      service.revokeToken(expiredJti, expiredTime);
      
      // Add a valid token (1 hour in future)
      const validJti = 'valid-token';
      const validTime = Math.floor(now / 1000) + 3600;
      service.revokeToken(validJti, validTime);
      
      // Run cleanup
      service.cleanupRevokedTokens();
      
      // Verify expired token was removed
      await expect(service.isTokenRevoked(expiredJti)).resolves.toBe(false);
      await expect(service.isTokenRevoked(validJti)).resolves.toBe(true);
    });
  })
})
