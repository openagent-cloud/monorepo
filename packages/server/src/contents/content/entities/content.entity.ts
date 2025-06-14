import { access_type, Prisma } from '@prisma/client'
import { BadRequestException, ConflictException } from '@nestjs/common'
import { ContentType } from '../../content-types/entities/content-type.entity'

/**
 * Content entity represents a piece of content in the system.
 * It follows the structure defined in the Prisma schema.
 */
export class Content {
	id: number
	title?: string
	metadata: Prisma.JsonValue
	access_type: access_type
	author_id: number
	content_type_id: number
	created_at: Date
	updated_at: Date
	uuid: string
	parent_id?: number
	version: number = 1 // Optimistic concurrency version number

	// Reaction counts (optional, loaded separately from content_reaction_counts table)
	reaction_counts?: {
		upvote_count: number
		downvote_count: number
		emoji_count: number
		total_count: number
		emoji_breakdown?: Record<string, number>
	}

	// Relationships (optional, can be loaded via include)
	children?: Content[]
	parent?: Content
	content_access?: ContentAccess[]
	content_type?: ContentType
	
	/**
	 * Create a new Content instance with partial data
	 */
	constructor(partial?: Partial<Content>) {
		if (partial) {
			Object.assign(this, partial)
		}
	}

	/**
	 * Validates if the content has required fields
	 */
	validate(): boolean {
		if (!this.author_id) {
			throw new BadRequestException('Content must have an author_id')
		}

		if (!this.content_type_id) {
			throw new BadRequestException('Content must have a content_type_id')
		}

		if (!this.metadata || typeof this.metadata !== 'object') {
			throw new BadRequestException('Content must have valid metadata')
		}

		return true
	}

	/**
	 * Validates this content's metadata against its content type schema
	 * @param contentType Optional contentType to use for validation (if not already loaded)
	 * @returns True if valid, throws error if invalid
	 */
	validateAgainstSchema(contentType?: ContentType): boolean {
		// Use provided contentType or the one loaded in the relationship
		const type = contentType || this.content_type
		
		if (!type) {
			throw new BadRequestException('Cannot validate content: no content type available')
		}
		
		// Use the contentType's validation method
		return type.validateContent(this.metadata as Record<string, unknown>)
	}

	/**
	 * Determines if the content is a comment
	 */
	isComment(): boolean {
		return !!this.parent_id
	}

	/**
	 * Determines if the content is public
	 */
	isPublic(): boolean {
		return this.access_type === access_type.public
	}

	/**
	 * Determines if the content is restricted or needs special access
	 */
	isRestricted(): boolean {
		const restrictedTypes = [
			access_type.paywalled,
			access_type.private,
			access_type.restricted,
			access_type.subscriber,
			access_type.tokengated,
		]
		return restrictedTypes.some((type) => type === this.access_type)
	}

	/**
	 * Gets a value from metadata with type safety
	 */
	getMetadataValue<T>(key: string, defaultValue: T = null as unknown as T): T {
		if (!this.metadata || typeof this.metadata !== 'object' || !(key in (this.metadata as object))) {
			return defaultValue
		}
		return (this.metadata as Record<string, unknown>)[key] as T
	}
	
	/**
	 * Sets a value in the metadata object
	 */
	setMetadataValue<T>(key: string, value: T): this {
		if (!this.metadata || typeof this.metadata !== 'object') {
			this.metadata = {}
		}
		
		(this.metadata as Record<string, unknown>)[key] = value
		return this
	}
	
	/**
	 * Increments the version when the content is updated
	 * This helps with optimistic concurrency control
	 */
	incrementVersion(): this {
		this.version = (this.version || 1) + 1
		return this
	}
	
	/**
	 * Verifies that the expected version matches the current version
	 * @param expectedVersion The version the client expects this content to be at
	 * @throws ContentVersionConflictError if versions don't match
	 */
	verifyVersion(expectedVersion: number): boolean {
		if (expectedVersion !== undefined && this.version !== expectedVersion) {
			throw new ContentVersionConflictError(
				this.id,
				this.version,
				expectedVersion
			)
		}
		return true
	}

	/**
	 * Creates a summary representation of the content (useful for lists)
	 */
	toSummary() {
		return {
			id: this.id,
			title: this.title,
			access_type: this.access_type,
			created_at: this.created_at,
			updated_at: this.updated_at,
			content_type_id: this.content_type_id,
			author_id: this.author_id,
			uuid: this.uuid,
			content_type_name: this.content_type?.name,
			parent_id: this.parent_id,
			version: this.version,
			// Include reaction counts if available
			reaction_counts: this.reaction_counts ? {
				upvote_count: this.reaction_counts.upvote_count,
				downvote_count: this.reaction_counts.downvote_count,
				emoji_count: this.reaction_counts.emoji_count,
				total_count: this.reaction_counts.total_count,
				// Only include emoji breakdown in detailed views, not summaries
			} : undefined
		}
	}

	/**
	 * Factory method to create a Content instance from database model
	 */
	static fromPrisma(data: Record<string, unknown>): Content {
		const content = new Content()
		Object.assign(content, data)

		// Ensure dates are properly cast
		if (data.created_at) {
			const createdAt = data.created_at as string | number | Date
			content.created_at = new Date(createdAt)
		}

		if (data.updated_at) {
			const updatedAt = data.updated_at as string | number | Date
			content.updated_at = new Date(updatedAt)
		}
		
		// Ensure version is set (default to 1 if not present)
		content.version = (data.version as number) || 1

		// Handle nested content_type relationship if it exists
		if (data.content_type && typeof data.content_type === 'object') {
			const contentTypeData = data.content_type as Record<string, unknown>
			content.content_type = ContentType.fromPrisma(contentTypeData)
		}

		// Handle nested parent relationship
		if (data.parent && typeof data.parent === 'object') {
			const parentData = data.parent as Record<string, unknown>
			content.parent = Content.fromPrisma(parentData)
		}

		// Handle children if they exist
		if (Array.isArray(data.children)) {
			content.children = data.children.map(child => Content.fromPrisma(child as Record<string, unknown>))
		}

		return content
	}
}

/**
 * Interface representing the content access relationship
 */
export interface ContentAccess {
	content_id: number
	user_id: number
	type: string
}

/**
 * Type definition for content filtering options
 */
export interface ContentFilter {
	contentTypeId?: number
	contentTypeName?: string
	authorId?: number
	parentId?: number | null
	accessType?: access_type
	searchTerm?: string
	tags?: string[]
}

/**
 * Type definition for content sorting options
 */
export interface ContentSorting {
	field: string
	direction: 'asc' | 'desc'
}

/**
 * Type definition for pagination options
 */
export interface PaginationOptions {
	// Offset-based pagination
	skip?: number
	take?: number
	
	// Cursor-based pagination (for better performance with large datasets)
	cursor?: {
		id?: number
		createdAt?: Date
	}
}

/**
 * Error thrown when a content update has a version conflict
 */
export class ContentVersionConflictError extends ConflictException {
	currentVersion: number;
	attemptedVersion: number;
	contentId: number;

	constructor(contentId: number, currentVersion: number, attemptedVersion: number) {
		super(`Content version conflict: content #${contentId} is at version ${currentVersion}, but update attempted with version ${attemptedVersion}`);
		this.contentId = contentId;
		this.currentVersion = currentVersion;
		this.attemptedVersion = attemptedVersion;
		this.name = 'ContentVersionConflictError';
	}
}

/**
 * Interface for the content update data with version control
 */
export interface ContentUpdateData {
	title?: string;
	metadata?: Prisma.JsonValue;
	access_type?: access_type;
	content_type_id?: number;
	parent_id?: number | null;
	expectedVersion?: number; // Version expected by the client
}
