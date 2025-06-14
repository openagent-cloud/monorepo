import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { ContentTypesService } from '../content-types/content-types.service'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import {
  Content,
  ContentSorting,
  PaginationOptions,
  ContentVersionConflictError
} from './entities/content.entity'
import { ContentType } from '../content-types/entities/content-type.entity'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name)

  constructor(
    private prisma: PrismaService,
    private contentTypesService: ContentTypesService
  ) {}

  async create(createContentDto: CreateContentDto, tenantId: number): Promise<Content> {
    // Verify the content type exists and belongs to the tenant
    const contentType = await this.prisma.content_type.findFirst({
      where: {
        id: createContentDto.content_type_id,
        tenant_id: tenantId // Ensure content type belongs to tenant
      }
    })

    if (!contentType) {
      throw new BadRequestException(
        `Content type with ID ${createContentDto.content_type_id} not found for this tenant`
      )
    }

    // If there's a parent, verify it exists and belongs to the tenant
    if (createContentDto.parent_id) {
      const parent = await this.prisma.content.findFirst({
        where: {
          id: createContentDto.parent_id,
          tenant_id: tenantId // Ensure parent belongs to tenant
        }
      })

      if (!parent) {
        throw new BadRequestException(
          `Parent content with ID ${createContentDto.parent_id} not found for this tenant`
        )
      }
    }

    // Validate metadata against the content type schema if it exists
    const contentTypeEntity = new ContentType()
    Object.assign(contentTypeEntity, contentType)

    // Only validate if the content type has a schema
    if (contentType.schema) {
      try {
        contentTypeEntity.validateContent(createContentDto.metadata)
      } catch (error) {
        throw new BadRequestException(
          `Invalid metadata for content type ${contentType.name}: ${error.message}`
        )
      }
    }

    const content = await this.prisma.content.create({
      data: {
        title: createContentDto.title || undefined,
        metadata: createContentDto.metadata as any, // Convert to JsonValue for Prisma
        // Use access_level from DTO for access_type field in database
        access_type: createContentDto.access_level,
        author_id: createContentDto.author_id,
        content_type_id: createContentDto.content_type_id,
        parent_id: createContentDto.parent_id || undefined,
        tenant_id: tenantId // Set tenant_id on creation
      }
    })

    // Return the created content
    return content as unknown as Content
  }

  async findAll(params: {
    // Pagination params
    pagination?: PaginationOptions

    // Legacy pagination (for backward compatibility)
    skip?: number
    take?: number

    // Filtering params
    contentTypeId?: number
    contentTypeName?: string
    authorId?: number
    parentId?: number | null
    accessType?: string
    searchTerm?: string
    tags?: string[]

    // Sorting params
    sort?: ContentSorting[]

    // Tenant isolation
    tenantId: number // Required for tenant isolation
  }) {
    const {
      pagination,
      skip: legacySkip,
      take: legacyTake,
      contentTypeId,
      contentTypeName,
      authorId,
      parentId,
      accessType,
      searchTerm,
      tags,
      sort,
      tenantId // Extract tenant ID
    } = params

    // Handle pagination (support both new and legacy params)
    const skip = pagination?.skip ?? legacySkip ?? 0
    const take = pagination?.take ?? legacyTake ?? 50

    const where: any = {
      tenant_id: tenantId // Enforce tenant isolation
    }

    // Apply filters if provided
    if (contentTypeId) {
      where.content_type_id = contentTypeId
    }

    // Filter by content type name
    if (contentTypeName) {
      where.content_type = {
        name: contentTypeName,
        tenant_id: tenantId // Ensure content type belongs to tenant
      }
    }

    if (authorId) {
      where.author_id = authorId
    }

    // Handle parentId specially to allow filtering for root content
    if (parentId !== undefined) {
      where.parent_id = parentId
    }

    if (accessType) {
      where.access_type = accessType
    }

    // Full-text search on title and metadata
    if (searchTerm) {
      where.OR = [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
        // Note: Metadata search depends on your DB's JSON search capabilities
        // This works for PostgreSQL with proper JSON indexing
        // For metadata search, we'd need custom implementation based on DB
      ]
    }

    // Filter by tags if your metadata has a tags array
    if (tags && tags.length > 0) {
      // This implementation assumes metadata.tags exists and is an array
      // The exact query would depend on your database's JSON capabilities
      // For PostgreSQL, you might use a jsonb operator
    }

    // Build dynamic orderBy based on sort param or use default
    let orderBy: any = { created_at: 'desc' }

    if (sort && sort.length > 0) {
      // Convert from array of ContentSorting to Prisma orderBy format
      orderBy = {}

      for (const sortOption of sort) {
        // Convert camelCase fields to snake_case for Prisma
        const field = sortOption.field.replace(/([A-Z])/g, '_$1').toLowerCase()
        orderBy[field] = sortOption.direction
      }
    }

    // Handle cursor-based pagination if provided
    if (pagination?.cursor) {
      where.AND = where.AND || []

      // For cursor pagination, we need to add a filter like "id > cursor.id"
      if (pagination.cursor.id) {
        where.AND.push({
          id: { gt: pagination.cursor.id }
        })
      }

      // If sorting by created_at, add that to cursor too
      if (pagination.cursor.createdAt) {
        where.AND.push({
          created_at: { gt: pagination.cursor.createdAt }
        })
      }
    }

    const items = await this.prisma.content.findMany({
      skip,
      take,
      where,
      include: {
        content_type: true,
        parent: true
      },
      orderBy
    })

    const total = await this.prisma.content.count({ where })

    // Enhanced metadata for pagination and sorting
    const meta = {
      total,
      skip,
      take,
      hasMore: skip + take < total,
      cursor:
        items.length > 0
          ? {
              id: items[items.length - 1].id,
              createdAt: items[items.length - 1].created_at
            }
          : null,
      sortApplied: sort ? sort.map((s) => `${s.field}:${s.direction}`).join(',') : 'created_at:desc'
    }

    return {
      items,
      meta
    }
  }

  async findOne(id: number, tenantId: number) {
    const content = await this.prisma.content.findFirst({
      where: {
        id,
        tenant_id: tenantId // Enforce tenant isolation
      },
      include: {
        content_type: true,
        parent: true,
        children: {
          where: {
            tenant_id: tenantId // Also filter children by tenant
          },
          orderBy: {
            created_at: 'desc'
          }
        },
        content_access: {
          where: {
            tenant_id: tenantId // Filter content access by tenant
          }
        }
      }
    })

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found for this tenant`)
    }

    // Get reaction counts if they exist
    const contentEntity = Content.fromPrisma(content)
    const reactionCounts = await this.getReactionCounts(id, tenantId)

    if (reactionCounts) {
      contentEntity.reaction_counts = reactionCounts
    }

    // Return the content with reaction counts
    return contentEntity
  }

  async update(id: number, updateContentDto: UpdateContentDto, tenantId: number) {
    // Verify the content exists and belongs to the tenant
    const existingContent = await this.prisma.content.findFirst({
      where: {
        id,
        tenant_id: tenantId // Enforce tenant isolation
      },
      include: {
        content_type: true
      }
    })

    if (!existingContent) {
      throw new NotFoundException(`Content with ID ${id} not found`)
    }

    // Create a content entity for version checking
    const contentEntity = Content.fromPrisma(existingContent)

    // Optimistic concurrency control - check version if provided
    if (updateContentDto.expectedVersion !== undefined) {
      contentEntity.verifyVersion(updateContentDto.expectedVersion)
    }

    // If updating content_type_id, verify it exists
    if (updateContentDto.content_type_id) {
      const contentType = await this.prisma.content_type.findUnique({
        where: { id: updateContentDto.content_type_id }
      })

      if (!contentType) {
        throw new BadRequestException(
          `Content type with ID ${updateContentDto.content_type_id} not found`
        )
      }
    }

    // If there's a parent, verify it exists and is not the content itself
    if (updateContentDto.parent_id !== undefined) {
      if (updateContentDto.parent_id === id) {
        throw new BadRequestException(`Content cannot be its own parent`)
      }

      if (updateContentDto.parent_id !== null) {
        const parent = await this.prisma.content.findUnique({
          where: { id: updateContentDto.parent_id }
        })

        if (!parent) {
          throw new BadRequestException(
            `Parent content with ID ${updateContentDto.parent_id} not found`
          )
        }
      }
    } // If updating metadata, validate it against the content type schema
    if (updateContentDto.metadata !== undefined) {
      // Determine which content type to use for validation
      const typeId = updateContentDto.content_type_id || existingContent.content_type_id
      const contentType = await this.prisma.content_type.findUnique({
        where: { id: typeId }
      })

      if (contentType) {
        const contentTypeEntity = new ContentType()
        Object.assign(contentTypeEntity, contentType)

        // Only validate if the content type has a schema
        if (contentType.schema) {
          try {
            contentTypeEntity.validateContent(updateContentDto.metadata)
          } catch (error) {
            throw new BadRequestException(
              `Invalid metadata for content type ${contentType.name}: ${error.message}`
            )
          }
        }
      }
    }

    // Prepare update data object explicitly to avoid type issues
    const updateData: any = {}

    if (updateContentDto.title !== undefined) {
      updateData.title = updateContentDto.title
    }

    if (updateContentDto.metadata !== undefined) {
      updateData.metadata = updateContentDto.metadata
    }

    if (updateContentDto.access_type !== undefined) {
      updateData.access_type = updateContentDto.access_type
    }

    if (updateContentDto.parent_id !== undefined) {
      updateData.parent_id = updateContentDto.parent_id
    }

    // Increment version for optimistic concurrency control
    updateData.version = { increment: 1 }

    try {
      // Use Prisma's update with version condition if expectedVersion is provided
      const updatedContent = await this.prisma.content.update({
        where: {
          id,
          ...(updateContentDto.expectedVersion !== undefined && {
            version: updateContentDto.expectedVersion
          })
        },
        data: updateData,
        include: {
          content_type: true
        }
      })

      return Content.fromPrisma(updatedContent)
    } catch (error) {
      // Handle version conflict errors
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        // Record was not found, which means the version didn't match
        this.logger.warn(`Version conflict detected for content #${id}`)
        throw new ContentVersionConflictError(
          id,
          contentEntity.version,
          updateContentDto.expectedVersion || 0
        )
      }
      throw error
    }
  }

  async remove(id: number, tenantId: number) {
    // Verify the content exists and belongs to the tenant
    const existingContent = await this.prisma.content.findFirst({
      where: {
        id,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })

    if (!existingContent) {
      throw new NotFoundException(`Content with ID ${id} not found for this tenant`)
    }

    // First delete all related content_access entries
    await this.prisma.content_access.deleteMany({
      where: {
        content_id: id,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })

    // Check if this content has children
    const hasChildren = await this.prisma.content.findFirst({
      where: {
        parent_id: id,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })

    if (hasChildren) {
      // If there are children, update them to remove the parent reference
      await this.prisma.content.updateMany({
        where: {
          parent_id: id,
          tenant_id: tenantId // Enforce tenant isolation
        },
        data: { parent_id: null }
      })
    }

    // Now delete the content
    return this.prisma.content.delete({
      where: {
        id,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })
  }

  // Additional helper methods

  async findComments(contentId: number, tenantId: number) {
    // Find all comments for a specific content item
    return this.prisma.content.findMany({
      where: {
        parent_id: contentId,
        tenant_id: tenantId, // Enforce tenant isolation
        content_type: {
          name: 'comment',
          tenant_id: tenantId // Ensure content_type also belongs to tenant
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  }

  async findReactions(contentId: number, tenantId: number) {
    // Find all reactions for a specific content item
    const reactions = await this.prisma.content.findMany({
      where: {
        parent_id: contentId,
        tenant_id: tenantId, // Enforce tenant isolation
        content_type: {
          name: 'reaction',
          tenant_id: tenantId // Ensure content_type also belongs to tenant
        }
      },
      include: {
        content_type: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Also return the pre-computed reaction counts
    const counts = await this.getReactionCounts(contentId, tenantId)

    return {
      reactions: reactions.map((r) => Content.fromPrisma(r)),
      counts
    }
  }

  async getContentAccess(contentId: number, userId: number, tenantId: number) {
    // Check if a user has access to a specific content item
    const access = await this.prisma.content_access.findFirst({
      where: {
        content_id: contentId,
        user_id: userId,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })

    return access
  }

  async grantAccess(contentId: number, userId: number, accessType: string, tenantId: number) {
    // Verify the content exists and belongs to the tenant
    const content = await this.prisma.content.findFirst({
      where: {
        id: contentId,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })

    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found for this tenant`)
    }

    // Grant access to a content item for a specific user
    return this.prisma.content_access.create({
      data: {
        content_id: contentId,
        user_id: userId,
        type: accessType as any,
        tenant_id: tenantId // Set tenant_id on new record
      }
    })
  }

  async revokeAccess(contentId: number, userId: number, tenantId: number) {
    // Verify the content exists and belongs to the tenant
    const content = await this.prisma.content.findFirst({
      where: {
        id: contentId,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })

    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found for this tenant`)
    }

    // Revoke access to a content item for a specific user
    return this.prisma.content_access.deleteMany({
      where: {
        content_id: contentId,
        user_id: userId,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })
  }

  /**
   * Get pre-computed reaction counts for a content item
   * @param contentId The content ID to get counts for
   * @param tenantId The tenant ID to enforce isolation
   * @returns The reaction counts or null if none exist
   */
  async getReactionCounts(contentId: number, tenantId: number) {
    // Retrieve the pre-computed reaction counts from the dedicated table
    const counts = await this.prisma.content_reaction_counts.findFirst({
      where: {
        content_id: contentId,
        tenant_id: tenantId // Enforce tenant isolation
      }
    })

    if (!counts) {
      return null
    }

    // Transform the data to match our expected format
    return {
      upvote_count: counts.upvote_count,
      downvote_count: counts.downvote_count,
      emoji_count: counts.emoji_count,
      total_count: counts.total_count,
      emoji_breakdown: (counts.emoji_breakdown as Record<string, number>) || {}
    }
  }

  /**
   * Get reaction counts for multiple content items at once
   * @param contentIds Array of content IDs to get counts for
   * @param tenantId The tenant ID to enforce isolation
   * @returns Map of content ID to reaction counts
   */
  async getBulkReactionCounts(contentIds: number[], tenantId: number) {
    if (!contentIds.length) {
      return new Map()
    }

    // Fetch all reaction counts in a single query
    const counts = await this.prisma.content_reaction_counts.findMany({
      where: {
        content_id: { in: contentIds },
        tenant_id: tenantId // Enforce tenant isolation
      }
    })

    // Create a map of content ID to reaction counts
    const countsMap = new Map()

    counts.forEach((count) => {
      countsMap.set(count.content_id, {
        upvote_count: count.upvote_count,
        downvote_count: count.downvote_count,
        emoji_count: count.emoji_count,
        total_count: count.total_count,
        emoji_breakdown: (count.emoji_breakdown as Record<string, number>) || {}
      })
    })

    return countsMap
  }
}
