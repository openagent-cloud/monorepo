import Ajv, { JSONSchemaType } from 'ajv'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger
} from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { CreateContentTypeDto } from './dto/create-content-type.dto'
import { UpdateContentTypeDto } from './dto/update-content-type.dto'
import { ContentType } from './entities/content-type.entity'

/**
 * Interface for cached content type items
 */
interface CachedContentType {
  item: ContentType
  cachedAt: number
}

@Injectable()
export class ContentTypesService implements OnModuleInit {
  private readonly logger = new Logger(ContentTypesService.name)

  // In-memory cache maps
  private cacheById = new Map<number, CachedContentType>()
  private cacheByName = new Map<string, CachedContentType>()

  // Cache TTL in milliseconds (5 minutes)
  private readonly CACHE_TTL = 5 * 60 * 1000

  // Cache hit metrics for monitoring
  private cacheHits = 0
  private cacheMisses = 0

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps a Prisma content_type record to our ContentType entity
   */
  private mapToEntity(record: any): ContentType {
    // Simply return the record as our entity - no conversion needed
    // since we now use snake_case throughout the codebase
    return Object.assign(new ContentType(), record)
  }

  /**
   * Creates a new content type with schema validation
   */
  async create(createContentTypeDto: CreateContentTypeDto, tenantId: number): Promise<ContentType> {
    // Validate that the provided JSON schema is valid
    try {
      const ajv = new Ajv()
      ajv.compile(createContentTypeDto.schema)
    } catch (error: any) {
      throw new BadRequestException(`Invalid JSON schema: ${error?.message || 'Unknown error'}`)
    }

    // Check if a content type with the same name already exists in this tenant
    const existingContentType = await this.prisma.content_type.findFirst({
      where: {
        name: createContentTypeDto.name,
        tenant_id: tenantId
      }
    })

    if (existingContentType) {
      throw new BadRequestException(
        `Content type with name '${createContentTypeDto.name}' already exists`
      )
    }

    // Create the content type with tenant association
    const result = await this.prisma.content_type.create({
      data: {
        name: createContentTypeDto.name,
        access_level: createContentTypeDto.access_level,
        schema: createContentTypeDto.schema as JSONSchemaType<unknown>,
        tenant: {
          connect: { id: tenantId }
        }
      }
    })

    return this.mapToEntity(result)
  }

  /**
   * Returns all content types for a tenant
   */
  async findAll(tenantId: number): Promise<ContentType[]> {
    const results = await this.prisma.content_type.findMany({
      where: { tenant_id: tenantId },
      orderBy: { name: 'asc' }
    })

    return results.map((record) => this.mapToEntity(record))
  }

  /**
   * Initialize service and warm up the cache
   */
  async onModuleInit() {
    await this.warmUpCache()
    this.logger.log('ContentTypeService initialized with cache')
  }

  /**
   * Pre-load frequently used content types into cache
   * Note: Since we're now tenant-aware, this pre-loading is less effective
   * as it doesn't account for tenant_id in cache keys.
   */
  private async warmUpCache(): Promise<void> {
    try {
      const contentTypes = await this.prisma.content_type.findMany({
        take: 20, // Cache the first 20 content types
        orderBy: { id: 'asc' }
      })

      for (const ct of contentTypes) {
        const entity = this.mapToEntity(ct)
        this.addToCache(entity)
      }

      this.logger.log(`Cache warmed up with ${contentTypes.length} content types`)
    } catch (error) {
      this.logger.error('Failed to warm up content type cache', error)
    }
  }

  /**
   * Add a content type to both caches
   */
  private addToCache(contentType: ContentType): void {
    const cached: CachedContentType = {
      item: contentType,
      cachedAt: Date.now()
    }

    this.cacheById.set(contentType.id, cached)
    this.cacheByName.set(contentType.name, cached)
  }

  /**
   * Invalidate cache for a content type
   */
  private invalidateCache(id: number, name?: string): void {
    this.cacheById.delete(id)

    if (name) {
      this.cacheByName.delete(name)
    } else {
      // If name wasn't provided, search and remove from name cache
      for (const [cacheName, cached] of this.cacheByName.entries()) {
        if (cached.item.id === id) {
          this.cacheByName.delete(cacheName)
          break
        }
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const total = this.cacheHits + this.cacheMisses
    const hitRate = total > 0 ? this.cacheHits / total : 0

    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      total,
      hitRate: hitRate.toFixed(2),
      cachedItemsCount: this.cacheById.size
    }
  }

  /**
   * Finds a content type by ID (with caching), enforcing tenant isolation
   */
  async findOne(id: number, tenantId: number): Promise<ContentType> {
    // Try to get from cache first
    const cached = this.cacheById.get(id)

    if (cached && Date.now() - cached.cachedAt < this.CACHE_TTL) {
      // Cache hit - but still verify tenant_id for security
      if (cached.item.tenant_id !== tenantId) {
        throw new NotFoundException(`Content type with ID ${id} not found for this tenant`)
      }
      this.cacheHits++
      return cached.item
    }

    // Cache miss - fetch from database with tenant isolation
    this.cacheMisses++
    const contentType = await this.prisma.content_type.findFirst({
      where: {
        id,
        tenant_id: tenantId
      }
    })

    if (!contentType) {
      throw new NotFoundException(`Content type with ID ${id} not found`)
    }

    const entity = this.mapToEntity(contentType)

    // Add to cache
    this.addToCache(entity)

    return entity
  }

  /**
   * Finds a content type by name (with caching), enforcing tenant isolation
   */
  async findByName(name: string, tenantId: number): Promise<ContentType> {
    // For name-based lookups in multi-tenant environments, we need to combine name+tenantId
    // as the cache key, but our current cache structure doesn't support this.
    // This is a simplification that bypasses cache for now - in production this would need a proper
    // compound key cache implementation.

    // Cache miss - fetch from database with tenant isolation
    this.cacheMisses++
    const contentType = await this.prisma.content_type.findFirst({
      where: {
        name,
        tenant_id: tenantId
      }
    })

    if (!contentType) {
      throw new NotFoundException(`Content type with name '${name}' not found`)
    }

    const entity = this.mapToEntity(contentType)

    // We don't add to the name cache since it doesn't account for tenantId
    // But we can still cache by ID
    this.addToCache(entity)

    return entity
  }

  /**
   * Updates an existing content type with tenant isolation
   */
  async update(
    id: number,
    updateContentTypeDto: UpdateContentTypeDto,
    tenantId: number
  ): Promise<ContentType> {
    // Verify content type exists and belongs to this tenant
    const existingContentType = await this.findOne(id, tenantId)

    // Validate schema if provided
    if (updateContentTypeDto.schema) {
      try {
        const ajv = new Ajv()
        ajv.compile(updateContentTypeDto.schema)
      } catch (error: any) {
        throw new BadRequestException(`Invalid JSON schema: ${error?.message || 'Unknown error'}`)
      }
    }

    // Check name uniqueness if name is being updated (within tenant)
    if (updateContentTypeDto.name) {
      const existing = await this.prisma.content_type.findFirst({
        where: {
          name: updateContentTypeDto.name,
          tenant_id: tenantId
        }
      })

      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `Content type with name '${updateContentTypeDto.name}' already exists in this tenant`
        )
      }
    }

    // No conversion needed since we use snake_case throughout
    const updateData: any = { ...updateContentTypeDto }

    // Update the content type with tenant isolation
    const result = await this.prisma.content_type.update({
      where: {
        id,
        tenant_id: tenantId
      },
      data: updateData
    })

    // Invalidate cache
    this.invalidateCache(id, existingContentType.name)

    return this.mapToEntity(result)
  }

  /**
   * Removes a content type by ID with tenant isolation
   */
  async remove(id: number, tenantId: number): Promise<ContentType> {
    // Verify content type exists and belongs to this tenant
    const contentType = await this.findOne(id, tenantId)

    // Check if there are any content items using this content type
    // Also enforce tenant isolation here
    const contentCount = await this.prisma.content.count({
      where: {
        content_type_id: id,
        tenant_id: tenantId
      }
    })

    if (contentCount > 0) {
      throw new BadRequestException(
        `Cannot delete content type with ID ${id} because it is used by ${contentCount} content items`
      )
    }

    const result = await this.prisma.content_type.delete({
      where: {
        id,
        tenant_id: tenantId
      }
    })

    // Invalidate cache
    this.invalidateCache(id, contentType.name)

    return this.mapToEntity(result)
  }
}
