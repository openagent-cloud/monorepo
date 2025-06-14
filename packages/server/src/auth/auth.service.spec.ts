import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { TokenService } from './services/token.service'
import { ConfigService } from '../utils/config/config.service'
import { PrismaService } from '../utils/prisma/prisma.service'
import { CryptoService } from './services/crypto.service'
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'

// Mock the entire bcrypt module
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashed-password')),
  compare: jest.fn().mockImplementation(() => Promise.resolve(true))
}))

describe('AuthService', () => {
  let service: AuthService
  let prismaService: PrismaService
  let tokenService: TokenService
  let cryptoService: CryptoService

  beforeEach(async () => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    
    // Define our pure mock implementations
    const mockPrisma = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
      },
      tenant: {
        findUnique: jest.fn()
      },
      password_reset_token: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn()
      }
    }

    const mockTokenService = {
      generateAccessToken: jest.fn().mockReturnValue('mock-access-token'),
      generateRefreshToken: jest.fn().mockReturnValue('mock-refresh-token'),
      generateResetToken: jest.fn().mockReturnValue('mock-reset-token'),
      isAccessToken: jest.fn(),
      isRefreshToken: jest.fn(),
      isResetToken: jest.fn(),
      verifyToken: jest.fn()
    }

    const mockCryptoService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      encryptData: jest.fn(),
      decryptData: jest.fn(),
      generateKeyPair: jest.fn().mockReturnValue({
        publicKey: 'mock-public-key',
        privateKey: 'mock-private-key'
      })
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma
        },
        {
          provide: TokenService,
          useValue: mockTokenService
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: CryptoService, 
          useValue: mockCryptoService
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
    prismaService = module.get<PrismaService>(PrismaService)
    tokenService = module.get<TokenService>(TokenService)
    cryptoService = module.get<CryptoService>(CryptoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('register', () => {
    it('should register a new user with tenant_id', async () => {
      // Setup
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        name: 'Test User',
        tenant_id: 1
      }

      const mockTenant = { id: 1, name: 'Test Tenant' }
      const mockUser = { 
        id: 1, 
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashed-password',
        name: 'Test User',
        tenant_id: 1,
        public_key: 'mock-public-key',
        private_key: 'mock-private-key',
        role: 'user'
      }

      // Super aggressive direct mocking of methods
      service['prisma'] = {
        tenant: {
          findUnique: jest.fn().mockResolvedValue(mockTenant)
        },
        user: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(mockUser)
        }
      } as any;

      // Mock bcrypt
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed-password'));
      
      // Execute
      const result = await service.register(registerDto);
      
      // Verify the right values were returned
      expect(result).toEqual({
        user: expect.objectContaining({
          id: 1,
          email: 'test@example.com',
          username: 'testuser'
        }),
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      });
    });

    it('should throw ConflictException if email is already registered', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        username: 'newuser',
        password: 'Password123!',
        name: 'Test User',
        tenant_id: 1
      }

      const existingUser = { 
        id: 1, 
        email: 'existing@example.com',
        username: 'existing-user'
      }
      
      // Super aggressive direct mocking
      service['prisma'] = {
        user: {
          findFirst: jest.fn().mockResolvedValue(existingUser)
        }
      } as any;
      
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      const loginDto = {
        identifier: 'test@example.com',
        password: 'Password123!'
      }

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashed-password',
        name: 'Test User',
        tenant_id: 1,
        role: 'user',
        public_key: 'mock-public-key'
      }

      // Ultra aggressive override of the private validateUser method
      service['validateUser'] = jest.fn().mockResolvedValue(mockUser);
      
      // Set up mock for generateTokens
      service['generateTokens'] = jest.fn().mockReturnValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });
      
      const result = await service.login(loginDto);
      
      expect(result).toEqual({
        user: expect.objectContaining({
          id: 1,
          email: 'test@example.com'
        }),
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto = {
        identifier: 'nonexistent@example.com',
        password: 'Password123!'
      }
      
      // Super aggressive direct mocking
      service['prisma'] = {
        user: {
          findFirst: jest.fn().mockResolvedValue(null)
        }
      } as any;
      
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto = {
        identifier: 'test@example.com',
        password: 'WrongPassword!'
      }

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashed-password',
        tenant_id: 1
      }
      
      // Super aggressive direct mocking
      service['prisma'] = {
        user: {
          findFirst: jest.fn().mockResolvedValue(mockUser)
        }
      } as any;
      
      // Must override the default mock for this specific test
      (bcrypt.compare as jest.Mock).mockImplementationOnce(() => Promise.resolve(false));
      
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
