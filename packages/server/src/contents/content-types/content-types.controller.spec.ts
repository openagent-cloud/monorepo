import { Test, TestingModule } from '@nestjs/testing'
import { ContentTypesController } from './content-types.controller'
import { ContentTypesService } from './content-types.service'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { CreateContentTypeDto } from './dto/create-content-type.dto'
import { UpdateContentTypeDto } from './dto/update-content-type.dto'
import { access_type, user_role } from '@prisma/client'
import { ForbiddenException } from '@nestjs/common'
import { Request } from 'express'

// Mock service implementation
const mockContentTypesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByName: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}

// Mock PrismaService
const mockPrismaService = {
  content_type: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  content: {
    count: jest.fn()
  }
}

describe('ContentTypesController', () => {
  let controller: ContentTypesController
  let service: ContentTypesService
  const tenantId = 1

  // Mock superadmin request object with type assertion for test purposes
  const mockSuperadminRequest = {
    user: {
      id: 1,
      role: 'superadmin' as user_role,
      tenantId: tenantId
    }
  }

  // Mock regular user request object with type assertion for test purposes
  const mockRegularUserRequest = {
    user: {
      id: 1,
      role: 'user' as user_role,
      tenantId: tenantId
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentTypesController],
      providers: [
        {
          provide: ContentTypesService,
          useValue: mockContentTypesService
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    controller = module.get<ContentTypesController>(ContentTypesController)
    service = module.get<ContentTypesService>(ContentTypesService)

    // Reset mock calls between tests
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a content type when user is superadmin', async () => {
      const createDto: CreateContentTypeDto = {
        name: 'test-type',
        access_level: access_type.public,
        schema: { type: 'object', properties: {} }
      }
      const expectedResult = {
        id: 1,
        ...createDto,
        created_at: new Date(),
        updated_at: new Date(),
        tenant_id: tenantId
      }

      mockContentTypesService.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createDto, tenantId, mockSuperadminRequest as any)

      expect(mockContentTypesService.create).toHaveBeenCalledWith(createDto, tenantId)
      expect(result).toEqual(expectedResult)
    })

    it('should throw ForbiddenException when non-superadmin user tries to create content type', async () => {
      const createDto: CreateContentTypeDto = {
        name: 'test-type',
        access_level: access_type.public,
        schema: { type: 'object', properties: {} }
      }

      // Assert that the controller throws a ForbiddenException
      await expect(async () => {
        await controller.create(createDto, tenantId, mockRegularUserRequest as any)
      }).rejects.toThrow(ForbiddenException)

      expect(mockContentTypesService.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return array of content types', async () => {
      const mockContentTypes = [{ id: 1, name: 'Test Type', tenant_id: tenantId }]
      mockContentTypesService.findAll.mockResolvedValue(mockContentTypes)

      const result = await controller.findAll(tenantId)

      expect(mockContentTypesService.findAll).toHaveBeenCalledWith(tenantId)
      expect(result).toEqual(mockContentTypes)
    })
  })

  describe('findOne', () => {
    it('should return a single content type', async () => {
      const mockContentType = { id: 1, name: 'Test Type', tenant_id: tenantId }
      mockContentTypesService.findOne.mockResolvedValue(mockContentType)

      const result = await controller.findOne('1', tenantId)

      expect(mockContentTypesService.findOne).toHaveBeenCalledWith(1, tenantId)
      expect(result).toEqual(mockContentType)
    })
  })

  describe('findByName', () => {
    it('should return a content type by name', async () => {
      const mockContentType = { id: 1, name: 'test-type', tenant_id: tenantId }
      mockContentTypesService.findByName.mockResolvedValue(mockContentType)

      const result = await controller.findByName('test-type', tenantId)

      expect(mockContentTypesService.findByName).toHaveBeenCalledWith('test-type', tenantId)
      expect(result).toEqual(mockContentType)
    })
  })

  describe('update', () => {
    it('should update a content type when user is superadmin', async () => {
      const updateDto: UpdateContentTypeDto = { name: 'updated-type' }
      const mockUpdatedType = { id: 1, name: 'updated-type', tenant_id: tenantId }

      mockContentTypesService.update.mockResolvedValue(mockUpdatedType)

      const result = await controller.update('1', updateDto, tenantId, mockSuperadminRequest as any)

      expect(mockContentTypesService.update).toHaveBeenCalledWith(1, updateDto, tenantId)
      expect(result).toEqual(mockUpdatedType)
    })
    
    it('should throw ForbiddenException when non-superadmin user tries to update content type', async () => {
      const updateDto: UpdateContentTypeDto = { name: 'updated-type-name' }

      // Assert that the controller throws a ForbiddenException
      await expect(async () => {
        await controller.update('1', updateDto, tenantId, mockRegularUserRequest as any)
      }).rejects.toThrow(ForbiddenException)

      expect(mockContentTypesService.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a content type when user is superadmin', async () => {
      const mockDeletedType = { id: 1, deleted: true, tenant_id: tenantId }
      mockContentTypesService.remove.mockResolvedValue(mockDeletedType)

      const result = await controller.remove('1', tenantId, mockSuperadminRequest as any)

      expect(mockContentTypesService.remove).toHaveBeenCalledWith(1, tenantId)
      expect(result).toEqual(mockDeletedType)
    })
    
    it('should throw ForbiddenException when non-superadmin user tries to remove content type', async () => {
      // Assert that the controller throws a ForbiddenException
      await expect(async () => {
        await controller.remove('1', tenantId, mockRegularUserRequest as any)
      }).rejects.toThrow(ForbiddenException)

      expect(mockContentTypesService.remove).not.toHaveBeenCalled()
    })
  })
})
