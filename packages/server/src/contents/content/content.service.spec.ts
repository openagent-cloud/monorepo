import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ContentService } from './content.service'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { ContentTypesService } from '../content-types/content-types.service'
import { access_type } from '@prisma/client'
import { ContentVersionConflictError } from './entities/content.entity'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

// Mock PrismaService
const mockPrismaService = {
  content: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn()
  },
  content_type: {
    findUnique: jest.fn(),
    findFirst: jest.fn()
  },
  content_access: {
    findFirst: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn()
  },
  // Add missing content_reaction_counts mock
  content_reaction_counts: {
    findUnique: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn().mockResolvedValue(null)
  }
}

// Mock ContentTypesService
const mockContentTypesService = {
  findOne: jest.fn()
}

describe('ContentService', () => {
  let service: ContentService
  const testTenantId = 1 // Test tenant ID for all tests

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ContentTypesService, useValue: mockContentTypesService }
      ]
    }).compile()

    service = module.get<ContentService>(ContentService)

    // Reset mocks between tests
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create content successfully', async () => {
      const mockContentType = { id: 1, name: 'test-content-type', tenant_id: testTenantId }
      const createContentDto = {
        title: 'Test Content',
        metadata: { foo: 'bar' },
        access_level: access_type.public,
        author_id: 123,
        content_type_id: 1
      }
      const expectedResult = {
        id: 1,
        ...createContentDto,
        access_type: access_type.public,
        created_at: new Date(),
        updated_at: new Date(),
        tenant_id: testTenantId
      }

      mockPrismaService.content_type.findFirst.mockResolvedValue(mockContentType)
      mockPrismaService.content.create.mockResolvedValue(expectedResult)

      const result = await service.create(createContentDto, testTenantId)

      expect(mockPrismaService.content_type.findFirst).toHaveBeenCalledWith({
        where: {
          id: createContentDto.content_type_id,
          tenant_id: testTenantId
        }
      })
      expect(mockPrismaService.content.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: createContentDto.title,
          metadata: createContentDto.metadata,
          access_type: createContentDto.access_level,
          author_id: createContentDto.author_id,
          content_type_id: createContentDto.content_type_id,
          tenant_id: testTenantId
        })
      })
      expect(result).toEqual(expectedResult)
    })

    it('should throw BadRequestException if content type does not exist', async () => {
      mockPrismaService.content_type.findFirst.mockResolvedValue(null)

      const createContentDto = {
        title: 'Test Content',
        metadata: { foo: 'bar' },
        access_level: access_type.public,
        author_id: 123,
        content_type_id: 999 // Non-existent content type
      }

      await expect(service.create(createContentDto, testTenantId)).rejects.toThrow()
    })
  })

  describe('findAll', () => {
    it('should return paginated content items', async () => {
      const mockItems = [
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' }
      ]
      mockPrismaService.content.findMany.mockResolvedValue(mockItems)
      mockPrismaService.content.count.mockResolvedValue(10)

      const result = await service.findAll({ skip: 0, take: 10, tenantId: testTenantId })

      expect(mockPrismaService.content.findMany).toHaveBeenCalled()
      expect(result.items).toEqual(mockItems)
      expect(result.meta.total).toBe(10)
    })
  })

  describe('findOne', () => {
    it('should return a content item by id', async () => {
      const mockContentItem = { id: 1, title: 'Test Item', tenant_id: testTenantId, version: 1 }
      mockPrismaService.content.findFirst.mockResolvedValue(mockContentItem)

      const result = await service.findOne(1, testTenantId)

      expect(mockPrismaService.content.findFirst).toHaveBeenCalledWith({
        where: { id: 1, tenant_id: testTenantId },
        include: expect.any(Object)
      })
      expect(result).toEqual(mockContentItem)
    })

    it('should throw NotFoundException if content does not exist', async () => {
      mockPrismaService.content.findFirst.mockResolvedValue(null)

      await expect(service.findOne(999, testTenantId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update content successfully', async () => {
      const existingContent = {
        id: 1,
        title: 'Original Title',
        metadata: {},
        version: 1,
        tenant_id: testTenantId
      }
      const updateContentDto = { title: 'Updated Title', metadata: { updated: true } }
      const updatedContent = { ...existingContent, ...updateContentDto, version: 2 }

      mockPrismaService.content.findFirst.mockResolvedValue(existingContent)
      mockPrismaService.content.update.mockResolvedValue(updatedContent)

      const result = await service.update(1, updateContentDto, testTenantId)

      expect(mockPrismaService.content.findFirst).toHaveBeenCalledWith({
        where: { id: 1, tenant_id: testTenantId },
        include: {
          content_type: true
        }
      })
      expect(mockPrismaService.content.update).toHaveBeenCalled()
      expect(result).toEqual(updatedContent)
    })

    it('should throw NotFoundException if content does not exist', async () => {
      mockPrismaService.content.findFirst.mockResolvedValue(null)

      await expect(service.update(999, { title: 'Updated' }, testTenantId)).rejects.toThrow(
        NotFoundException
      )
    })

    it('should throw BadRequestException if content type does not exist', async () => {
      const existingContent = { id: 1, title: 'Original Title', version: 1 }
      mockPrismaService.content.findFirst.mockResolvedValue({
        id: 1,
        title: 'Original Title',
        tenant_id: testTenantId
      })
      mockPrismaService.content_type.findUnique.mockResolvedValue(null)

      await expect(service.update(1, { content_type_id: 999 }, testTenantId)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should throw BadRequestException if parent does not exist', async () => {
      const existingContent = { id: 1, title: 'Original Title', version: 1 }
      mockPrismaService.content.findFirst
        .mockResolvedValueOnce({ ...existingContent, tenant_id: testTenantId }) // For the initial content check
        .mockResolvedValueOnce(null) // For the parent check

      await expect(service.update(1, { parent_id: 999 }, testTenantId)).rejects.toThrow(
        BadRequestException
      )
    })

    describe('optimistic concurrency control', () => {
      it('should update content successfully when expectedVersion matches', async () => {
        // Setup test data
        const existingContent = {
          id: 1,
          title: 'Original Title',
          metadata: {},
          version: 5,
          tenant_id: testTenantId,
          content_type: { id: 1, name: 'test-type' }
        }

        const updateContentDto = {
          title: 'Updated with Version',
          metadata: { updated: true },
          expectedVersion: 5 // Match current version
        }

        const updatedContent = {
          id: 1,
          title: 'Updated with Version',
          metadata: { updated: true },
          version: 6, // Incremented
          tenant_id: testTenantId,
          content_type: { id: 1, name: 'test-type' }
        }

        // Reset all mocks
        jest.clearAllMocks()

        // Setup direct mock responses
        mockPrismaService.content.findFirst = jest.fn().mockResolvedValue(existingContent)
        mockPrismaService.content.update.mockResolvedValue(updatedContent)

        const result = await service.update(1, updateContentDto, testTenantId)

        expect(mockPrismaService.content.update).toHaveBeenCalledWith({
          where: {
            id: 1,
            version: 5 // Should include version in where clause
          },
          data: expect.objectContaining({
            title: 'Updated with Version',
            metadata: { updated: true },
            version: { increment: 1 } // Should increment version
          }),
          include: expect.any(Object)
        })
        expect(result).toEqual(updatedContent)
      })

      it('should throw ContentVersionConflictError when version mismatch occurs', async () => {
        const existingContent = {
          id: 1,
          title: 'Original Title',
          metadata: {},
          version: 5,
          tenant_id: testTenantId
        }
        const updateContentDto = {
          title: 'Updated with Version',
          metadata: { updated: true },
          expectedVersion: 4 // Mismatch with current version
        }

        mockPrismaService.content.findFirst.mockResolvedValue(existingContent)

        // Mock Prisma throwing a record not found error when version doesn't match
        const prismaError = new PrismaClientKnownRequestError('Record to update not found.', {
          code: 'P2025',
          clientVersion: '4.8.0'
        })
        mockPrismaService.content.update.mockRejectedValue(prismaError)

        await expect(service.update(1, updateContentDto, testTenantId)).rejects.toThrow(
          ContentVersionConflictError
        )
        await expect(service.update(1, updateContentDto, testTenantId)).rejects.toThrow(
          `Content version conflict: content #1 is at version 5, but update attempted with version 4`
        )
      })
    })
  })

  describe('remove', () => {
    it('should remove content successfully', async () => {
      const existingContent = { id: 1, title: 'Content To Delete', tenant_id: testTenantId }
      const deletedContent = { ...existingContent, deleted: true }

      mockPrismaService.content.findFirst.mockResolvedValue(existingContent)
      mockPrismaService.content.findMany.mockResolvedValue([])
      mockPrismaService.content.delete.mockResolvedValue(deletedContent) // No children
      mockPrismaService.content.delete.mockResolvedValue(deletedContent)

      const result = await service.remove(1, testTenantId)

      expect(mockPrismaService.content.findFirst).toHaveBeenCalledWith({
        where: { id: 1, tenant_id: testTenantId }
      })
      expect(mockPrismaService.content.delete).toHaveBeenCalledWith({
        where: { id: 1, tenant_id: testTenantId }
      })
      expect(result).toEqual(deletedContent)
    })

    it('should handle content with children by removing parent reference', async () => {
      const existingContent = { id: 1, title: 'Content To Delete', tenant_id: testTenantId }
      const childContent = { id: 2, parent_id: 1, title: 'Child Content', tenant_id: testTenantId }
      const deletedContent = { ...existingContent, deleted: true }

      mockPrismaService.content.findFirst.mockResolvedValue(existingContent)
      mockPrismaService.content.findMany.mockResolvedValue([childContent])
      mockPrismaService.content.updateMany.mockResolvedValue({ count: 1 })
      mockPrismaService.content.delete.mockResolvedValue(deletedContent)

      const result = await service.remove(1, testTenantId)

      expect(mockPrismaService.content.updateMany).toHaveBeenCalledWith({
        where: {
          parent_id: 1,
          tenant_id: testTenantId
        },
        data: { parent_id: null }
      })
      expect(mockPrismaService.content.delete).toHaveBeenCalledWith({
        where: { id: 1, tenant_id: testTenantId }
      })
      expect(result).toEqual(deletedContent)
    })

    it('should throw NotFoundException if content does not exist', async () => {
      mockPrismaService.content.findFirst.mockResolvedValue(null)

      await expect(service.remove(999, testTenantId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('findComments', () => {
    it('should return comments for a content item', async () => {
      const mockComments = [
        { id: 2, parent_id: 1, content_type: { name: 'comment' } },
        { id: 3, parent_id: 1, content_type: { name: 'comment' } }
      ]

      mockPrismaService.content.findMany.mockResolvedValue(mockComments)

      const result = await service.findComments(1, testTenantId)

      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({
        where: {
          parent_id: 1,
          tenant_id: testTenantId,
          content_type: {
            name: 'comment',
            tenant_id: testTenantId
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      })
      expect(result).toEqual(mockComments)
    })
  })

  describe('findReactions', () => {
    it('should return reactions for a content item', async () => {
      const mockReactions = [
        { id: 4, parent_id: 1, tenant_id: testTenantId, content_type: { name: 'reaction' } },
        { id: 5, parent_id: 1, tenant_id: testTenantId, content_type: { name: 'reaction' } }
      ]

      // Setup mocks
      mockPrismaService.content.findFirst.mockResolvedValue({ id: 1, tenant_id: testTenantId })
      mockPrismaService.content.findMany.mockResolvedValue(mockReactions)

      // Mock reaction counts
      mockPrismaService.content_reaction_counts.findUnique.mockResolvedValue({
        content_id: 1,
        upvote_count: 5,
        downvote_count: 2,
        emoji_count: 3,
        total_count: 10,
        emoji_breakdown: { '👍': 2, '❤️': 1 }
      })

      const result = await service.findReactions(1, testTenantId)

      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({
        where: {
          parent_id: 1,
          tenant_id: testTenantId,
          content_type: {
            name: 'reaction',
            tenant_id: testTenantId
          }
        },
        include: {
          content_type: true
        },
        orderBy: {
          created_at: 'desc'
        }
      })
      expect(result).toHaveProperty('reactions')
      expect(result).toHaveProperty('counts')
    })
  })

  describe('getContentAccess', () => {
    it('should return access for a user and content', async () => {
      const mockAccess = { content_id: 1, user_id: 2, type: 'subscriber', tenant_id: testTenantId }
      mockPrismaService.content_access.findFirst.mockResolvedValue(mockAccess)

      const result = await service.getContentAccess(1, 2, testTenantId)

      expect(mockPrismaService.content_access.findFirst).toHaveBeenCalledWith({
        where: {
          content_id: 1,
          user_id: 2,
          tenant_id: testTenantId
        }
      })
      expect(result).toEqual(mockAccess)
    })

    it('should return null if no access exists', async () => {
      mockPrismaService.content_access.findFirst.mockResolvedValue(null)

      const result = await service.getContentAccess(1, 2, testTenantId)

      expect(result).toBeNull()
    })
  })

  describe('grantAccess', () => {
    it('should grant access to content for a user', async () => {
      const mockContent = { id: 1, title: 'Test Content', tenant_id: testTenantId }
      const mockAccessRecord = {
        content_id: 1,
        user_id: 2,
        type: 'subscriber',
        tenant_id: testTenantId
      }

      mockPrismaService.content.findFirst.mockResolvedValue(mockContent)
      mockPrismaService.content_access.create.mockResolvedValue(mockAccessRecord)

      const result = await service.grantAccess(1, 2, 'subscriber', testTenantId)

      expect(mockPrismaService.content.findFirst).toHaveBeenCalledWith({
        where: { id: 1, tenant_id: testTenantId }
      })
      expect(mockPrismaService.content_access.create).toHaveBeenCalledWith({
        data: {
          content_id: 1,
          user_id: 2,
          type: 'subscriber',
          tenant_id: testTenantId
        }
      })
      expect(result).toEqual(mockAccessRecord)
    })

    it('should throw NotFoundException if content does not exist', async () => {
      mockPrismaService.content.findFirst.mockResolvedValue(null)

      await expect(service.grantAccess(999, 2, 'subscriber', testTenantId)).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('revokeAccess', () => {
    it('should revoke access for a user to content', async () => {
      const mockContent = { id: 1, title: 'Test Content' }
      const deleteResult = { count: 1 }

      mockPrismaService.content.findFirst.mockResolvedValue(mockContent)
      mockPrismaService.content_access.deleteMany.mockResolvedValue(deleteResult)

      const result = await service.revokeAccess(1, 2, testTenantId)

      expect(mockPrismaService.content.findFirst).toHaveBeenCalledWith({
        where: { id: 1, tenant_id: testTenantId }
      })
      expect(mockPrismaService.content_access.deleteMany).toHaveBeenCalledWith({
        where: {
          content_id: 1,
          user_id: 2,
          tenant_id: testTenantId
        }
      })
      expect(result).toEqual(deleteResult)
    })

    it('should throw NotFoundException if content does not exist', async () => {
      mockPrismaService.content.findFirst.mockResolvedValue(null)

      await expect(service.revokeAccess(999, 2, testTenantId)).rejects.toThrow(NotFoundException)
    })
  })
})
