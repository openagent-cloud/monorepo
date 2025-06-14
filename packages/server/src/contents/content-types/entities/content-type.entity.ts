import { content_type, access_type, Prisma } from '@prisma/client'
import { BadRequestException } from '@nestjs/common'
import { ZodSchema, z } from 'zod'
import { Content } from '../../content/entities/content.entity'

/**
 * ContentType entity represents a schema definition for content in the system.
 * It follows the structure defined in the Prisma schema.
 */
export class ContentType implements content_type {
  id: number
  uuid: string
  name: string
  access_level: access_type
  schema: Prisma.JsonValue
  tenant_id: number
  created_at: Date
  updated_at: Date

  // Relationships (optional, can be loaded via include)
  contents?: Content[]

  /**
   * Validates if the content type has required fields
   */
  validate(): boolean {
    if (!this.name) {
      throw new BadRequestException('Content type must have a name')
    }

    if (!this.schema || typeof this.schema !== 'object') {
      throw new BadRequestException('Content type must have a valid schema')
    }

    return true
  }

  /**
   * Validates content metadata against this content type's schema
   * @param metadata The metadata to validate
   * @returns True if valid, throws an error if invalid
   */
  validateContent(metadata: Record<string, unknown>): boolean {
    if (!this.schema) {
      throw new BadRequestException('Content type has no schema for validation')
    }

    if (!metadata || typeof metadata !== 'object') {
      throw new BadRequestException({
        message: `Invalid metadata format for content type '${this.name}'`,
        details: 'Metadata must be a valid object',
        receivedType: typeof metadata,
        contentTypeId: this.id
      })
    }

    try {
      // Try to parse the schema as a Zod schema
      const schemaDefinition = this.schema as unknown as {
        type: string
        properties: Record<string, unknown>
      }

      // Build a dynamic schema based on the content type's schema definition
      const zodSchema = this.buildZodSchema(schemaDefinition)

      // Validate the metadata against the schema
      zodSchema.parse(metadata)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Create more detailed error messages with field paths
        const formattedErrors = error.errors.map((err) => {
          // Base error info that all ZodIssues have
          const baseError = {
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }

          // Handle specific error types with type guard to safely access properties
          switch (err.code) {
            case 'invalid_type':
              return {
                ...baseError,
                expected: (err as z.ZodInvalidTypeIssue).expected,
                received: (err as z.ZodInvalidTypeIssue).received
              }
            case 'invalid_literal':
              return {
                ...baseError,
                expected: (err as z.ZodInvalidLiteralIssue).expected,
                received: (err as z.ZodInvalidLiteralIssue).received
              }
            case 'invalid_union':
              return {
                ...baseError,
                unionErrors: (err as z.ZodInvalidUnionIssue).unionErrors.map((e) => e.message)
              }
            default:
              return baseError
          }
        })

        throw new BadRequestException({
          message: 'Content metadata does not match the content type schema',
          contentTypeId: this.id,
          schemaName: this.name,
          errors: formattedErrors,
          rawMetadata: metadata
        })
      }

      throw new BadRequestException({
        message: `Failed to validate content for type '${this.name}'`,
        errorMessage: error instanceof Error ? error.message : String(error),
        contentTypeId: this.id,
        schemaName: this.name
      })
    }
  }

  /**
   * Build a Zod schema from the content type's schema definition
   * @param schemaDefinition The schema definition object
   * @returns A Zod schema for validation
   */
  private buildZodSchema(schemaDefinition: {
    type: string
    properties: Record<string, unknown>
  }): ZodSchema {
    // This is a simplified implementation - in a real app, you'd handle all types of schemas
    const { properties } = schemaDefinition
    const shape: Record<string, ZodSchema> = {}

    // Convert the schema properties to Zod schemas
    for (const [key, propDef] of Object.entries(properties)) {
      const prop = propDef as { type: string; required?: boolean }

      // Create a Zod schema based on the property type
      let propSchema: ZodSchema
      switch (prop.type) {
        case 'string':
          propSchema = z.string()
          break
        case 'number':
          propSchema = z.number()
          break
        case 'boolean':
          propSchema = z.boolean()
          break
        case 'object':
          propSchema = z.record(z.unknown())
          break
        case 'array':
          propSchema = z.array(z.unknown())
          break
        default:
          propSchema = z.unknown()
      }

      // Make the property optional if not required
      if (prop.required !== true) {
        propSchema = propSchema.optional()
      }

      shape[key] = propSchema
    }

    return z.object(shape)
  }

  /**
   * Creates a summary representation of the content type (useful for lists)
   */
  toSummary() {
    return {
      id: this.id,
      name: this.name,
      access_level: this.access_level,
      created_at: this.created_at,
      updated_at: this.updated_at,
      uuid: this.uuid
    }
  }

  /**
   * Factory method to create a ContentType instance from database model
   */
  static fromPrisma(data: Record<string, unknown>): ContentType {
    const contentType = new ContentType()
    Object.assign(contentType, data)

    // Ensure dates are properly cast
    if (data.created_at) {
      const createdAt = data.created_at as string | number | Date
      contentType.created_at = new Date(createdAt)
    }

    if (data.updated_at) {
      const updatedAt = data.updated_at as string | number | Date
      contentType.updated_at = new Date(updatedAt)
    }

    return contentType
  }
}
