import { IsNotEmpty, IsString, IsObject, IsEnum } from 'class-validator'
import { access_type } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class CreateContentTypeDto {
	@ApiProperty({ description: 'Name of the content type', example: 'music' })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({
		description: 'Default access level for this content type',
		enum: access_type,
		default: access_type.public,
	})
	@IsEnum(access_type as object, { message: 'Invalid access level type' })
	access_level: access_type = access_type.public

	@ApiProperty({
		description: 'JSON Schema definition for this content type',
		example: { type: 'object', properties: { title: { type: 'string' } } },
	})
	@IsObject()
	schema: Record<string, unknown>
}
