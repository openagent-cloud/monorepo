import { BadRequestException } from '@nestjs/common'
import { access_type } from '@prisma/client'
import { ContentType } from '../../content-types/entities/content-type.entity'
import { Content } from './content.entity'

describe('Content and ContentType Integration', () => {
  let contentType: ContentType
  let content: Content

  beforeEach(() => {
    // Set up a content type with a schema
    contentType = new ContentType()
    contentType.id = 1
    contentType.name = 'Article'
    contentType.uuid = '123e4567-e89b-12d3-a456-426614174000'
    contentType.access_level = access_type.public
    contentType.schema = {
      type: 'object',
      properties: {
        title: { type: 'string', required: true },
        body: { type: 'string', required: true },
        tags: { type: 'array' },
        rating: { type: 'number' }
      }
    }
    contentType.created_at = new Date()
    contentType.updated_at = new Date()

    // Set up a content item
    content = new Content()
    content.id = 1
    content.title = 'Test Content'
    content.metadata = {
      title: 'My Article',
      body: 'This is the article body',
      tags: ['test', 'article'],
      rating: 4.5
    }
    content.access_type = access_type.public
    content.author_id = 123
    content.content_type_id = 1
    content.content_type = contentType // Link the content type
    content.created_at = new Date()
    content.updated_at = new Date()
    content.uuid = '223e4567-e89b-12d3-a456-426614174000'
  })

  describe('validateAgainstSchema', () => {
    it('should validate content metadata against content type schema', () => {
      expect(content.validateAgainstSchema()).toBe(true)
    })

    it('should accept a content type parameter if not already linked', () => {
      content.content_type = undefined // Remove the linked content type
      expect(content.validateAgainstSchema(contentType)).toBe(true)
    })

    it('should throw BadRequestException if no content type is available', () => {
      content.content_type = undefined // Remove the linked content type
      expect(() => content.validateAgainstSchema()).toThrow(BadRequestException)
      expect(() => content.validateAgainstSchema()).toThrow(
        'Cannot validate content: no content type available'
      )
    })

    it('should throw BadRequestException if metadata does not match schema', () => {
      // Missing required 'body' field
      content.metadata = {
        title: 'Invalid Article',
        tags: ['test']
      }

      expect(() => content.validateAgainstSchema()).toThrow(BadRequestException)
      expect(() => content.validateAgainstSchema()).toThrow(
        'Content metadata does not match the content type schema'
      )
    })

    it('should throw BadRequestException if metadata has wrong types', () => {
      // Rating should be a number, not a string
      content.metadata = {
        title: 'Invalid Article',
        body: 'This is the body',
        rating: 'five stars'
      }

      expect(() => content.validateAgainstSchema()).toThrow(BadRequestException)
    })
  })

  describe('ContentType.validateContent', () => {
    it('should validate content directly through content type', () => {
      const metadata = {
        title: 'Direct Validation',
        body: 'Testing direct validation through content type',
        tags: ['test']
      }

      expect(contentType.validateContent(metadata)).toBe(true)
    })

    it('should throw BadRequestException if schema is missing', () => {
      contentType.schema = null

      expect(() => contentType.validateContent({ title: 'Test' })).toThrow(BadRequestException)
      expect(() => contentType.validateContent({ title: 'Test' })).toThrow(
        'Content type has no schema for validation'
      )
    })

    it('should handle complex validation errors', () => {
      try {
        contentType.validateContent({})
      } catch (error) {
        // Check that the error has proper structure with ZodError details
        expect(error).toBeInstanceOf(BadRequestException)
        const errorResponse = error.getResponse()
        expect(errorResponse.message).toBe(
          'Content metadata does not match the content type schema'
        )
        expect(Array.isArray(errorResponse.errors)).toBe(true)
      }
    })
  })

  describe('Bidirectional relationship', () => {
    it('should allow navigation from Content to ContentType', () => {
      expect(content.content_type).toBe(contentType)
      expect(content.content_type_id).toBe(contentType.id)
    })

    it('should allow access to schema via content type', () => {
      expect(content.content_type?.schema).toBeDefined()
      const schema = content.content_type?.schema as any
      expect(schema.properties.title.type).toBe('string')
    })
  })
})
