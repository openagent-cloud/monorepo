import { ApiProperty } from '@nestjs/swagger'
import { access_type } from '@prisma/client'
import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator'

export class CreateContentDto {
	@IsString()
	@IsOptional()
	title?: string

	@IsObject()
	@IsNotEmpty()
	metadata: Record<string, unknown>

	@ApiProperty({
		description: 'Default access level for this content type',
		enum: access_type,
		default: access_type.public,
	})
	@IsEnum(access_type as object, { message: 'Invalid access level type' })
	access_level: access_type = access_type.public

	@IsInt()
	@IsNotEmpty()
	author_id: number

	@IsInt()
	@IsNotEmpty()
	content_type_id: number

	@IsInt()
	@IsOptional()
	parent_id?: number
}
