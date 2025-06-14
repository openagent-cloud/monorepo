import { BadRequestException } from '@nestjs/common'
import { access_type } from '@prisma/client'
import { Content, ContentAccess } from './content.entity'

describe('Content Entity', () => {
  let content: Content

  beforeEach(() => {
    // Create a valid content object for testing
    content = new Content()
    content.id = 1
    content.title = 'Test Content'
    content.metadata = { foo: 'bar' }
    content.access_type = access_type.public
    content.author_id = 123
    content.content_type_id = 456
    content.created_at = new Date('2025-01-01')
    content.updated_at = new Date('2025-01-02')
    content.uuid = '123e4567-e89b-12d3-a456-426614174000'
  })

  describe('validate', () => {
    it('should validate a valid content object', () => {
      expect(content.validate()).toBe(true)
    })

    it('should throw BadRequestException if author_id is missing', () => {
      content.author_id = null as any
      expect(() => content.validate()).toThrow(BadRequestException)
      expect(() => content.validate()).toThrow('Content must have an author_id')
    })

    it('should throw BadRequestException if content_type_id is missing', () => {
      content.content_type_id = null as any
      expect(() => content.validate()).toThrow(BadRequestException)
      expect(() => content.validate()).toThrow('Content must have a content_type_id')
    })

    it('should throw BadRequestException if metadata is missing', () => {
      content.metadata = null as any
      expect(() => content.validate()).toThrow(BadRequestException)
      expect(() => content.validate()).toThrow('Content must have valid metadata')
    })
  })

  describe('isComment', () => {
    it('should return false if parent_id is not set', () => {
      content.parent_id = undefined
      expect(content.isComment()).toBe(false)
    })

    it('should return true if parent_id is set', () => {
      content.parent_id = 999
      expect(content.isComment()).toBe(true)
    })
  })

  describe('isPublic', () => {
    it('should return true if access_type is public', () => {
      content.access_type = access_type.public
      expect(content.isPublic()).toBe(true)
    })

    it('should return false if access_type is not public', () => {
      content.access_type = access_type.private
      expect(content.isPublic()).toBe(false)
    })
  })

  describe('isRestricted', () => {
    it('should return false if access_type is public', () => {
      content.access_type = access_type.public
      expect(content.isRestricted()).toBe(false)
    })

    it('should return true if access_type is private', () => {
      content.access_type = access_type.private
      expect(content.isRestricted()).toBe(true)
    })

    it('should return true if access_type is paywalled', () => {
      content.access_type = access_type.paywalled
      expect(content.isRestricted()).toBe(true)
    })

    it('should return true if access_type is restricted', () => {
      content.access_type = access_type.restricted
      expect(content.isRestricted()).toBe(true)
    })

    it('should return true if access_type is subscriber', () => {
      content.access_type = access_type.subscriber
      expect(content.isRestricted()).toBe(true)
    })

    it('should return true if access_type is tokengated', () => {
      content.access_type = access_type.tokengated
      expect(content.isRestricted()).toBe(true)
    })
  })

  describe('getMetadataValue', () => {
    it('should return the value if it exists in metadata', () => {
      content.metadata = { name: 'John', age: 30 }
      expect(content.getMetadataValue('name')).toBe('John')
      expect(content.getMetadataValue('age')).toBe(30)
    })

    it('should return the default value if key does not exist', () => {
      content.metadata = { name: 'John' }
      expect(content.getMetadataValue('height', 180)).toBe(180)
    })

    it('should return null if key does not exist and no default is provided', () => {
      content.metadata = { name: 'John' }
      expect(content.getMetadataValue('height')).toBeNull()
    })

    it('should return default value if metadata is null', () => {
      content.metadata = null as any
      expect(content.getMetadataValue('name', 'default')).toBe('default')
    })
  })

  describe('toSummary', () => {
    it('should return a summary object with basic content properties', () => {
      const summary = content.toSummary()
      expect(summary).toEqual({
        id: 1,
        title: 'Test Content',
        access_type: access_type.public,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
        content_type_id: 456,
        author_id: 123,
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        parent_id: undefined,
        content_type_name: undefined,
        version: 1
      })
    })

    it('should not include metadata in the summary', () => {
      content.metadata = { sensitive: 'data' }
      const summary = content.toSummary()
      // Check that metadata isn't included as a property
      expect(Object.keys(summary).includes('metadata')).toBe(false)
    })
  })

  describe('fromPrisma', () => {
    it('should create a Content instance from prisma data', () => {
      const prismaData = {
        id: 2,
        title: 'Prisma Content',
        metadata: { source: 'prisma' },
        access_type: access_type.subscriber,
        author_id: 456,
        content_type_id: 789,
        created_at: '2025-02-01T00:00:00.000Z',
        updated_at: '2025-02-02T00:00:00.000Z',
        uuid: '223e4567-e89b-12d3-a456-426614174000',
        parent_id: 1
      }

      const result = Content.fromPrisma(prismaData)

      expect(result).toBeInstanceOf(Content)
      expect(result.id).toBe(2)
      expect(result.title).toBe('Prisma Content')
      expect(result.metadata).toEqual({ source: 'prisma' })
      expect(result.access_type).toBe(access_type.subscriber)
      expect(result.author_id).toBe(456)
      expect(result.content_type_id).toBe(789)
      expect(result.created_at).toBeInstanceOf(Date)
      expect(result.created_at.toISOString()).toBe('2025-02-01T00:00:00.000Z')
      expect(result.updated_at).toBeInstanceOf(Date)
      expect(result.updated_at.toISOString()).toBe('2025-02-02T00:00:00.000Z')
      expect(result.uuid).toBe('223e4567-e89b-12d3-a456-426614174000')
      expect(result.parent_id).toBe(1)
    })

    it('should handle missing date fields', () => {
      const prismaData = {
        id: 3,
        title: 'No Dates',
        metadata: {},
        access_type: access_type.public,
        author_id: 789,
        content_type_id: 101,
        uuid: '323e4567-e89b-12d3-a456-426614174000'
      }

      const result = Content.fromPrisma(prismaData)

      expect(result).toBeInstanceOf(Content)
      expect(result.id).toBe(3)
      expect(result.created_at).toBeUndefined()
      expect(result.updated_at).toBeUndefined()
    })
  })

  describe('ContentAccess interface', () => {
    it('should define a ContentAccess with required properties', () => {
      const access: ContentAccess = {
        content_id: 1,
        user_id: 2,
        type: 'subscriber'
      }

      expect(access.content_id).toBe(1)
      expect(access.user_id).toBe(2)
      expect(access.type).toBe('subscriber')
    })
  })
})
