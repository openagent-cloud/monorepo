import { Test, TestingModule } from '@nestjs/testing';
import { OptionalAuthMiddleware } from './optional-auth.middleware';
import { TokenService } from '../services/token.service';
import { PrismaService } from '../../utils/prisma/prisma.service';
import { Request, Response } from 'express';

describe('OptionalAuthMiddleware', () => {
  let middleware: OptionalAuthMiddleware;
  let tokenService: TokenService;
  let prismaService: PrismaService;
  
  // Mock user data
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    role: 'USER',
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    is_verified: true
  };

  // Mock request, response, next function
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  // Mock token
  const mockToken = 'valid.mock.token';
  const mockPayload = { sub: 1, tenant_id: 1, jti: 'token-id' };

  beforeEach(async () => {
    // Create mocks for TokenService
    const mockTokenService = {
      isAccessToken: jest.fn(),
      verifyToken: jest.fn(),
      isTokenRevoked: jest.fn()
    };

    // Create mocks for PrismaService
    const mockPrismaService = {
      user: {
        findUnique: jest.fn()
      }
    };

    // Create test module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionalAuthMiddleware,
        { provide: TokenService, useValue: mockTokenService },
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    // Get service instances
    middleware = module.get<OptionalAuthMiddleware>(OptionalAuthMiddleware);
    tokenService = module.get<TokenService>(TokenService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Reset mocks and setup default responses
    jest.clearAllMocks();

    // Default mock request, response and next
    mockRequest = {
      headers: {}
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should continue without user when no auth header is present', async () => {
    // No authorization header in request
    await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Next should be called
    expect(mockNext).toHaveBeenCalled();
    
    // User should not be attached to request
    expect(mockRequest['user']).toBeUndefined();
  });

  it('should continue without user when auth header format is invalid', async () => {
    // Invalid format (no Bearer prefix)
    mockRequest.headers = { authorization: mockToken };
    
    await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest['user']).toBeUndefined();
  });

  it('should attach user to request when valid token is provided', async () => {
    // Setup valid auth header
    mockRequest.headers = { authorization: `Bearer ${mockToken}` };
    
    // Mock token service to return valid info
    (tokenService.isAccessToken as jest.Mock).mockReturnValue(true);
    (tokenService.verifyToken as jest.Mock).mockReturnValue(mockPayload);
    
    // Mock prisma to return a user
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    
    await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Verify expected behavior
    expect(tokenService.isAccessToken).toHaveBeenCalledWith(mockToken);
    expect(tokenService.verifyToken).toHaveBeenCalledWith(mockToken);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockPayload.sub },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        name: true,
        avatar_url: true,
        is_verified: true
      }
    });
    
    // User should be attached to request
    expect(mockRequest['user']).toEqual(mockUser);
    
    // Next should be called
    expect(mockNext).toHaveBeenCalled();
  });

  it('should continue without user when token is not an access token', async () => {
    // Setup auth header
    mockRequest.headers = { authorization: `Bearer ${mockToken}` };
    
    // Mock token service to indicate not an access token
    (tokenService.isAccessToken as jest.Mock).mockReturnValue(false);
    
    await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Token type should be checked
    expect(tokenService.isAccessToken).toHaveBeenCalledWith(mockToken);
    
    // Token verification should not be called
    expect(tokenService.verifyToken).not.toHaveBeenCalled();
    
    // User lookup should not be performed
    expect(prismaService.user.findUnique).not.toHaveBeenCalled();
    
    // User should not be attached
    expect(mockRequest['user']).toBeUndefined();
    
    // Next should be called
    expect(mockNext).toHaveBeenCalled();
  });

  it('should continue without user when token verification fails', async () => {
    // Setup auth header
    mockRequest.headers = { authorization: `Bearer ${mockToken}` };
    
    // Mock token service to throw on verification
    (tokenService.isAccessToken as jest.Mock).mockReturnValue(true);
    (tokenService.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Verification should be attempted
    expect(tokenService.isAccessToken).toHaveBeenCalledWith(mockToken);
    expect(tokenService.verifyToken).toHaveBeenCalledWith(mockToken);
    
    // User lookup should not be performed
    expect(prismaService.user.findUnique).not.toHaveBeenCalled();
    
    // User should not be attached
    expect(mockRequest['user']).toBeUndefined();
    
    // Next should be called - middleware should not throw
    expect(mockNext).toHaveBeenCalled();
  });

  it('should continue without user when user not found', async () => {
    // Setup auth header
    mockRequest.headers = { authorization: `Bearer ${mockToken}` };
    
    // Mock token service to return valid info
    (tokenService.isAccessToken as jest.Mock).mockReturnValue(true);
    (tokenService.verifyToken as jest.Mock).mockReturnValue(mockPayload);
    
    // Mock prisma to return null (user not found)
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
    
    await middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Verification should happen
    expect(tokenService.isAccessToken).toHaveBeenCalled();
    expect(tokenService.verifyToken).toHaveBeenCalled();
    expect(prismaService.user.findUnique).toHaveBeenCalled();
    
    // User should not be attached
    expect(mockRequest['user']).toBeUndefined();
    
    // Next should be called
    expect(mockNext).toHaveBeenCalled();
  });

  // Test extractTokenFromHeader method directly
  it('should extract token from authorization header', () => {
    mockRequest.headers = { authorization: `Bearer ${mockToken}` };
    
    // Access the private method using type assertion
    const token = (middleware as any).extractTokenFromHeader(mockRequest as Request);
    
    expect(token).toBe(mockToken);
  });

  it('should return undefined when authorization header has wrong format', () => {
    mockRequest.headers = { authorization: `Wrong ${mockToken}` };
    
    // Access the private method using type assertion
    const token = (middleware as any).extractTokenFromHeader(mockRequest as Request);
    
    expect(token).toBeUndefined();
  });
});
