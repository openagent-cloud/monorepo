import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { user_role } from '@prisma/client'
import { UpdateUserSettingsDto } from './dto/user-settings.dto'
import { PrismaService } from '../utils/prisma/prisma.service'
import { AuthGuard } from '../auth/guards/auth.guard'

// Mock user service
const mockUserService = {
  getUserSettings: jest.fn(),
  updateUserSettings: jest.fn(),
  getUserById: jest.fn(),
  deleteUser: jest.fn()
}

// Mock PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}

// Mock AuthGuard
class MockAuthGuard {
  canActivate() {
    return true
  }
}

describe('UserController', () => {
  let controller: UserController
  let service: UserService

  // Mock request object with authenticated user having tenantId
  const mockRequest = {
    user: {
      id: 1,
      userId: 1,
      role: 'user' as user_role,
      tenantId: 1
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: AuthGuard,
          useClass: MockAuthGuard
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)

    // Reset mock calls between tests
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })

  describe('getCurrentUserSettings', () => {
    it('should return user settings for current user with tenantId', async () => {
      const mockSettings = { id: 1, username: 'testuser' }
      mockUserService.getUserSettings.mockResolvedValue(mockSettings)

      const result = await controller.getCurrentUserSettings(mockRequest)

      expect(mockUserService.getUserSettings).toHaveBeenCalledWith(
        mockRequest.user.id,
        mockRequest.user.id,
        mockRequest.user.role,
        mockRequest.user.tenantId
      )
      expect(result).toEqual(mockSettings)
    })
  })

  describe('updateCurrentUserSettings', () => {
    it('should update user settings for current user with tenantId', async () => {
      const updateDto: UpdateUserSettingsDto = { name: 'New Name' }
      const mockUpdatedSettings = { id: 1, name: 'New Name' }
      
      mockUserService.updateUserSettings.mockResolvedValue(mockUpdatedSettings)

      const result = await controller.updateCurrentUserSettings(mockRequest, updateDto)

      expect(mockUserService.updateUserSettings).toHaveBeenCalledWith(
        mockRequest.user.id,
        updateDto,
        mockRequest.user.id,
        mockRequest.user.role,
        mockRequest.user.tenantId
      )
      expect(result).toEqual(mockUpdatedSettings)
    })
  })

  describe('getUserSettings', () => {
    it('should return user settings by ID with tenantId', async () => {
      const userId = 2
      const mockSettings = { id: userId, username: 'otheruser' }
      
      mockUserService.getUserSettings.mockResolvedValue(mockSettings)

      const result = await controller.getUserSettings(userId, mockRequest)

      expect(mockUserService.getUserSettings).toHaveBeenCalledWith(
        userId,
        mockRequest.user.id,
        mockRequest.user.role,
        mockRequest.user.tenantId
      )
      expect(result).toEqual(mockSettings)
    })
  })

  describe('updateUserSettings', () => {
    it('should update user settings by ID with tenantId', async () => {
      const userId = 2
      const updateDto: UpdateUserSettingsDto = { name: 'Updated Other User' }
      const mockUpdatedSettings = { id: userId, name: 'Updated Other User' }
      
      mockUserService.updateUserSettings.mockResolvedValue(mockUpdatedSettings)

      const result = await controller.updateUserSettings(userId, mockRequest, updateDto)

      expect(mockUserService.updateUserSettings).toHaveBeenCalledWith(
        userId,
        updateDto,
        mockRequest.user.id,
        mockRequest.user.role,
        mockRequest.user.tenantId
      )
      expect(result).toEqual(mockUpdatedSettings)
    })
  })

  describe('deleteUser', () => {
    it('should delete user by ID with tenantId', async () => {
      const userId = 2
      const mockResponse = { message: 'User account deleted successfully' }
      
      mockUserService.deleteUser.mockResolvedValue(mockResponse)

      const result = await controller.deleteUser(userId, mockRequest)

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(
        userId,
        mockRequest.user.id,
        mockRequest.user.role,
        mockRequest.user.tenantId
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteCurrentUser', () => {
    it('should delete current user account with tenantId', async () => {
      const mockResponse = { message: 'User account deleted successfully' }
      
      mockUserService.deleteUser.mockResolvedValue(mockResponse)

      const result = await controller.deleteCurrentUser(mockRequest)

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(
        mockRequest.user.id,
        mockRequest.user.id,
        mockRequest.user.role,
        mockRequest.user.tenantId
      )
      expect(result).toEqual(mockResponse)
    })
  })
})
