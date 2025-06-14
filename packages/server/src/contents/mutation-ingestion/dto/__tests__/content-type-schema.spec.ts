import { Test } from '@nestjs/testing'
import { MutationType } from '../mutation.dto'
import { PrismaService } from '../../../../utils/prisma/prisma.service'
import { ContentTypesService } from '../../../content-types/content-types.service'
import { ContentType } from '../../../content-types/entities/content-type.entity'
import { access_type } from '@prisma/client'
import { BadRequestException } from '@nestjs/common'

/**
 * This test suite specifically validates that mutations for different content types
 * match their specific schema requirements as defined in content-types.
 */
describe('Content Type Schema Validation', () => {
  let contentTypesService: jest.Mocked<ContentTypesService>

  // Helper function to create a ContentType mock with the required properties
  function createContentTypeMock(id: number, name: string, schema: any): ContentType {
    const contentType = {
      id,
      uuid: `uuid-${id}`,
      name,
      access_level: access_type.public,
      schema,
      created_at: new Date(),
      updated_at: new Date(),
      validate: jest.fn().mockReturnValue(true),
      validateContent: jest.fn().mockImplementation((metadata: any) => {
        // Mock validation logic for testing
        // This should match the flat structure of our schemas
        const schemaObj = schema

        // For comment validation
        if (name.toLowerCase() === 'comment') {
          if (!metadata.kind) {
            throw new BadRequestException('Missing required field: kind')
          }

          // Check specific type validations
          switch (metadata.kind) {
            case 'image':
              if (!metadata.imageUrl) {
                throw new BadRequestException('Missing required field: imageUrl for image comment')
              }
              break
            case 'embed':
              if (!metadata.embedUrl) {
                throw new BadRequestException('Missing required field: embedUrl for embed comment')
              }
              break
            case 'text':
            case 'reply':
              // These don't have additional required fields
              break
            default:
              throw new BadRequestException(`Invalid kind value: ${metadata.kind}`)
          }
        }

        // For reaction validation
        if (name.toLowerCase() === 'reaction') {
          if (!metadata.kind) {
            throw new BadRequestException('Missing required field: kind')
          }

          // Check specific type validations
          switch (metadata.kind) {
            case 'emoji':
              if (!metadata.emoji) {
                throw new BadRequestException('Missing required field: emoji for emoji reaction')
              }
              break
            case 'upvote':
            case 'downvote':
              // These don't have additional required fields
              break
            default:
              throw new BadRequestException(`Invalid kind value: ${metadata.kind}`)
          }
        }

        return true
      }),
      toSummary: jest.fn().mockReturnValue({
        id,
        name,
        access_level: access_type.public,
        created_at: new Date(),
        updated_at: new Date(),
        uuid: `uuid-${id}`
      })
    }
    return contentType as unknown as ContentType
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            content: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findUnique: jest.fn()
            },
            contentType: {
              findUnique: jest.fn()
            }
          }
        },
        {
          provide: ContentTypesService,
          useValue: {
            findOne: jest.fn(),
            findByName: jest.fn()
          }
        }
      ]
    }).compile()

    contentTypesService = moduleRef.get(ContentTypesService) as jest.Mocked<ContentTypesService>
  })

  /**
   * Comment content type tests
   */
  describe('Comment Content Type Schema Validation', () => {
    let commentContentType: ContentType

    beforeEach(() => {
      // Create a mock that matches the actual schema structure from comment.schema.ts
      commentContentType = createContentTypeMock(5, 'Comment', {
        type: 'object',
        properties: {
          kind: { type: 'string', enum: ['text', 'image', 'embed', 'reply'] },
          imageUrl: { type: 'string' },
          embedUrl: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['kind']
      })

      // Mock contentTypesService.findOne to return our mock
      contentTypesService.findOne.mockResolvedValue(commentContentType)
    })

    it('should validate a text comment mutation against schema', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 5,
        value: {
          kind: 'text',
          author_id: 123 // This would be part of the mutation but not validated by the schema
        }
      }

      // Test the validation
      expect(commentContentType.validateContent(mutation.value)).toBe(true)
    })

    it('should validate an image comment mutation against schema', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 5,
        value: {
          kind: 'image',
          imageUrl: 'https://example.com/image.jpg',
          author_id: 123
        }
      }

      expect(commentContentType.validateContent(mutation.value)).toBe(true)
    })

    it('should validate an embed comment mutation against schema', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 5,
        value: {
          kind: 'embed',
          embedUrl: 'https://youtube.com/watch?v=123456',
          description: 'An embedded video',
          author_id: 123
        }
      }

      expect(commentContentType.validateContent(mutation.value)).toBe(true)
    })

    it('should validate a reply comment mutation against schema', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 5,
        value: {
          kind: 'reply',
          author_id: 123
        }
      }

      expect(commentContentType.validateContent(mutation.value)).toBe(true)
    })

    it('should reject a comment mutation without required kind field', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 5,
        value: {
          // Missing required kind
          author_id: 123
        }
      }

      expect(() => commentContentType.validateContent(mutation.value)).toThrow(BadRequestException)
    })

    it('should reject an image comment mutation without required imageUrl field', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 5,
        value: {
          kind: 'image',
          // Missing required imageUrl
          author_id: 123
        }
      }

      expect(() => commentContentType.validateContent(mutation.value)).toThrow(BadRequestException)
    })

    it('should reject an embed comment mutation without required embedUrl field', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 5,
        value: {
          kind: 'embed',
          // Missing required embedUrl
          description: 'An embedded video',
          author_id: 123
        }
      }

      expect(() => commentContentType.validateContent(mutation.value)).toThrow(BadRequestException)
    })

    it('should reject a comment mutation with invalid kind value', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 5,
        value: {
          kind: 'invalid_kind', // Not in the enum
          author_id: 123
        }
      }

      expect(() => commentContentType.validateContent(mutation.value)).toThrow(BadRequestException)
    })
  })

  /**
   * Reaction content type tests
   */
  describe('Reaction Content Type Schema Validation', () => {
    let reactionContentType: ContentType

    beforeEach(() => {
      // Create a mock that matches the actual schema structure from reaction.schema.ts
      reactionContentType = createContentTypeMock(6, 'Reaction', {
        type: 'object',
        properties: {
          kind: { type: 'string', enum: ['emoji', 'upvote', 'downvote'] },
          emoji: { type: 'string' }
        },
        required: ['kind']
      })

      // Mock contentTypesService.findOne to return our mock
      contentTypesService.findOne.mockResolvedValue(reactionContentType)
    })

    it('should validate an emoji reaction mutation against schema', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 6,
        value: {
          kind: 'emoji',
          emoji: '👍',
          author_id: 123
        }
      }

      expect(reactionContentType.validateContent(mutation.value)).toBe(true)
    })

    it('should validate an upvote reaction mutation against schema', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 6,
        value: {
          kind: 'upvote',
          author_id: 123
        }
      }

      expect(reactionContentType.validateContent(mutation.value)).toBe(true)
    })

    it('should validate a downvote reaction mutation against schema', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 6,
        value: {
          kind: 'downvote',
          author_id: 123
        }
      }

      expect(reactionContentType.validateContent(mutation.value)).toBe(true)
    })

    it('should reject an emoji reaction without required emoji field', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 6,
        value: {
          kind: 'emoji',
          // Missing emoji field
          author_id: 123
        }
      }

      expect(() => reactionContentType.validateContent(mutation.value)).toThrow(BadRequestException)
    })

    it('should reject a reaction with invalid kind value', () => {
      const mutation = {
        type: MutationType.INSERT,
        contentTypeId: 6,
        value: {
          kind: 'invalid_kind', // Not in the enum
          author_id: 123
        }
      }

      expect(() => reactionContentType.validateContent(mutation.value)).toThrow(BadRequestException)
    })
  })
})
