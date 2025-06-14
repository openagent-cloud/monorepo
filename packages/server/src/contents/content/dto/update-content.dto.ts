import { PartialType } from '@nestjs/mapped-types'
import { access_type } from '@prisma/client'
import { IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator'
import { CreateContentDto } from './create-content.dto'

export class UpdateContentDto extends PartialType(CreateContentDto) {
	@IsString()
	@IsOptional()
	title?: string

	@IsObject()
	@IsOptional()
	metadata?: Record<string, unknown>

	@IsEnum(access_type)
	@IsOptional()
	access_type?: access_type

	@IsInt()
	@IsOptional()
	parent_id?: number
	
	/**
	 * Version expected by the client for optimistic concurrency control
	 * If provided, update will only succeed if the current version matches
	 */
	@IsInt()
	@Min(1)
	@IsOptional()
	expectedVersion?: number
}
