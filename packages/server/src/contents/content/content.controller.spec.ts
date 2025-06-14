import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { ContentController } from './content.controller'
import { ContentService } from './content.service'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { access_type } from '@prisma/client'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { AuthGuard } from '../../auth/guards/auth.guard'

// Mock the auth decorators
jest.mock('../../auth/decorators/auth-decorators', () => ({
  GetTenant: jest.fn().mockImplementation(() => {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      return descriptor
    }
  }),
  RequireModules: jest.fn().mockImplementation(() => {
    return (target: any) => target
  })
}))

// Mock AuthGuard
jest.mock('../../auth/guards/auth.guard', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return { canActivate: jest.fn().mockReturnValue(true) }
  })
}))

// Mock service implementation
const mockContentService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findComments: jest.fn(),
  findReactions: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  grantAccess: jest.fn(),
  revokeAccess: jest.fn()
}

describe('ContentController', () => {
  let controller: ContentController
  let service: ContentService
  // Mock tenant ID (previously extracted from request)
  const mockTenantId = 1

  beforeEach(async () => {
    // No need to mock the decorator here since we've mocked it globally above

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [
        {
          provide: ContentService,
          useValue: mockContentService
        },
        {
          provide: PrismaService,
          useValue: {
            tenant: { findUnique: jest.fn() },
            content: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn()
            },
            $transaction: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<ContentController>(ContentController)
    service = module.get<ContentService>(ContentService)

    // Reset mock calls between tests
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create content', async () => {
      const createDto: CreateContentDto = {
        title: 'Test Content',
        author_id: 1,
        content_type_id: 1,
        metadata: { kind: 'text' },
        access_level: access_type.public
      }
      const expectedResult = { id: 1, ...createDto }

      mockContentService.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createDto, mockTenantId)

      expect(mockContentService.create).toHaveBeenCalledWith(createDto, mockTenantId)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('findAll', () => {
    it('should return array of content with default pagination', async () => {
      const mockContent = [{ id: 1, title: 'Test Content' }]
      mockContentService.findAll.mockResolvedValue(mockContent)

      const result = await controller.findAll(mockTenantId, 0, 50)

      expect(mockContentService.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 50,
        contentTypeId: undefined,
        authorId: undefined,
        parentId: undefined,
        tenantId: mockTenantId,
        accessType: undefined
      })
      expect(result).toEqual(mockContent)
    })

    it('should apply filters when provided', async () => {
      mockContentService.findAll.mockResolvedValue([])

      await controller.findAll(mockTenantId, 10, 20, '1', '2', '3', 'public')

      expect(mockContentService.findAll).toHaveBeenCalledWith({
        skip: 10,
        take: 20,
        contentTypeId: 1,
        authorId: 2,
        parentId: 3,
        accessType: 'public',
        tenantId: mockTenantId
      })
    })
  })

  describe('findOne', () => {
    it('should return a single content item', async () => {
      const mockContent = { id: 1, title: 'Test Content' }
      mockContentService.findOne.mockResolvedValue(mockContent)

      const result = await controller.findOne(1, mockTenantId)

      expect(mockContentService.findOne).toHaveBeenCalledWith(1, mockTenantId)
      expect(result).toEqual(mockContent)
    })
  })

  describe('findComments', () => {
    it('should return comments for a content item', async () => {
      const mockComments = [{ id: 2, title: 'Test Comment', parent_id: 1 }]
      mockContentService.findComments.mockResolvedValue(mockComments)

      const result = await controller.findComments(1, mockTenantId)

      expect(mockContentService.findComments).toHaveBeenCalledWith(1, mockTenantId)
      expect(result).toEqual(mockComments)
    })
  })

  describe('findReactions', () => {
    it('should return reactions for a content item', async () => {
      const mockReactions = [{ id: 3, kind: 'emoji', emoji: '🔥', parent_id: 1 }]
      mockContentService.findReactions.mockResolvedValue(mockReactions)

      const result = await controller.findReactions(1, mockTenantId)

      expect(mockContentService.findReactions).toHaveBeenCalledWith(1, mockTenantId)
      expect(result).toEqual(mockReactions)
    })
  })

  describe('update', () => {
    it('should update content', async () => {
      const updateDto: UpdateContentDto = { title: 'Updated Title' }
      const mockUpdatedContent = { id: 1, title: 'Updated Title' }

      mockContentService.update.mockResolvedValue(mockUpdatedContent)

      const result = await controller.update(1, updateDto, mockTenantId)

      expect(mockContentService.update).toHaveBeenCalledWith(1, updateDto, mockTenantId)
      expect(result).toEqual(mockUpdatedContent)
    })
  })

  describe('remove', () => {
    it('should remove content', async () => {
      const mockDeletedContent = { id: 1, deleted: true }
      mockContentService.remove.mockResolvedValue(mockDeletedContent)

      const result = await controller.remove(1, mockTenantId)

      expect(mockContentService.remove).toHaveBeenCalledWith(1, mockTenantId)
      expect(result).toEqual(mockDeletedContent)
    })
  })

  describe('grantAccess', () => {
    it('should grant access to content', async () => {
      const mockAccessRecord = {
        content_id: 1,
        user_id: 2,
        type: access_type.subscriber
      }
      mockContentService.grantAccess.mockResolvedValue(mockAccessRecord)

      const result = await controller.grantAccess(1, 2, access_type.subscriber, mockTenantId)

      expect(mockContentService.grantAccess).toHaveBeenCalledWith(
        1,
        2,
        access_type.subscriber,
        mockTenantId
      )
      expect(result).toEqual(mockAccessRecord)
    })

    it('should throw BadRequestException if accessType is missing', async () => {
      try {
        await controller.grantAccess(1, 2, '', mockTenantId)
        // If we reach here, the test should fail because no exception was thrown
        fail('Expected BadRequestException to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toBe('accessType is required')
      }
    })

    it('should throw BadRequestException if accessType is invalid', async () => {
      try {
        await controller.grantAccess(1, 2, 'invalid_type', mockTenantId)
        // If we reach here, the test should fail because no exception was thrown
        fail('Expected BadRequestException to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toContain('Invalid access type')
      }
    })
  })

  describe('revokeAccess', () => {
    it('should revoke access to content', async () => {
      const mockResult = { success: true }
      mockContentService.revokeAccess.mockResolvedValue(mockResult)

      const result = await controller.revokeAccess(1, 2, mockTenantId)

      expect(mockContentService.revokeAccess).toHaveBeenCalledWith(1, 2, mockTenantId)
      expect(result).toEqual(mockResult)
    })
  })
})
