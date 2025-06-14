import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { HttpStatus } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { PasswordResetRequestDto } from './dto/password-reset-request.dto'
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto'
import { PrismaService } from '../utils/prisma/prisma.service'
import { AuthGuard } from './guards/auth.guard'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn()
  }

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    name: 'Test User',
    tenant_id: '123e4567-e89b-12d3-a456-426614174000',
    avatar_url: 'https://example.com/avatar.jpg'
  }

  const mockTokens = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    user: mockUser
  }
  
  // Mock AuthGuard
  jest.mock('./guards/auth.guard', () => ({
    AuthGuard: jest.fn().mockImplementation(() => {
      return { canActivate: jest.fn().mockReturnValue(true) }
    })
  }))

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn()
            },
            tenant: {
              findUnique: jest.fn()
            },
            $transaction: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should login a user and return tokens', async () => {
      const loginDto: LoginDto = {
        identifier: 'testuser',
        password: 'password123'
      }
      
      mockAuthService.login.mockResolvedValue(mockTokens)
      
      const result = await controller.login(loginDto)
      
      expect(authService.login).toHaveBeenCalledWith(loginDto)
      expect(result).toEqual(mockTokens)
    })
    
    it('should support login with email as identifier', async () => {
      const loginDto: LoginDto = {
        identifier: 'test@example.com',
        password: 'password123'
      }
      
      mockAuthService.login.mockResolvedValue(mockTokens)
      
      const result = await controller.login(loginDto)
      
      expect(authService.login).toHaveBeenCalledWith(loginDto)
      expect(result).toEqual(mockTokens)
    })
  })

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        tenant_id: 1234 // Using numeric tenant ID as required by RegisterDto
      }
      
      mockAuthService.register.mockResolvedValue(mockTokens)
      
      const result = await controller.register(registerDto)
      
      expect(authService.register).toHaveBeenCalledWith(registerDto)
      expect(result).toEqual(mockTokens)
    })
  })

  describe('getProfile', () => {
    it('should return the user profile from request', () => {
      const req = { user: mockUser }
      
      const result = controller.getProfile(req)
      
      expect(result).toEqual(mockUser)
    })
  })

  describe('refreshToken', () => {
    it('should refresh the tokens', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refresh_token: 'old-refresh-token'
      }
      
      mockAuthService.refreshToken.mockResolvedValue({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token'
      })
      
      const result = await controller.refreshToken(refreshTokenDto)
      
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto)
      expect(result).toEqual({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token'
      })
    })
  })

  describe('requestPasswordReset', () => {
    it('should request a password reset', async () => {
      const resetRequestDto: PasswordResetRequestDto = {
        identifier: 'test@example.com'
      }
      
      mockAuthService.requestPasswordReset.mockResolvedValue({
        message: 'Password reset email sent'
      })
      
      const result = await controller.requestPasswordReset(resetRequestDto)
      
      expect(authService.requestPasswordReset).toHaveBeenCalledWith(resetRequestDto)
      expect(result).toEqual({ message: 'Password reset email sent' })
    })
  })

  describe('confirmPasswordReset', () => {
    it('should confirm password reset', async () => {
      const confirmResetDto: PasswordResetConfirmDto = {
        token: 'reset-token',
        password: 'new-password'
      }
      
      mockAuthService.resetPassword.mockResolvedValue({
        message: 'Password reset successful'
      })
      
      const result = await controller.confirmPasswordReset(confirmResetDto)
      
      expect(authService.resetPassword).toHaveBeenCalledWith(confirmResetDto)
      expect(result).toEqual({ message: 'Password reset successful' })
    })
  })
})
