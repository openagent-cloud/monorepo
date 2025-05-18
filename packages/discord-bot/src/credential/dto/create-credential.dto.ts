import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsObject, IsOptional, IsString, MinLength, Matches } from 'class-validator'
import { Transform } from 'class-transformer'
import { AdapterType } from '@prisma/client'

// Valid adapter types from the Prisma schema
const VALID_ADAPTER_TYPES = ['openai', 'anthropic', 'cohere'];

/**
 * DTO for creating or updating a credential
 */
export class CreateCredentialDto {
  @ApiProperty({
    description: 'The service/adapter type for the credential',
    enum: AdapterType,
    enumName: 'AdapterType',
    example: 'openai',
    examples: ['openai', 'anthropic', 'cohere'],
  })
  @Transform(({ value }) => value?.toLowerCase())
  @IsNotEmpty({ message: 'Service is required' })
  @Matches(new RegExp(`^(${VALID_ADAPTER_TYPES.join('|')})$`, 'i'), {
    message: `Service must be one of: ${VALID_ADAPTER_TYPES.join(', ')}`
  })
  service: string

  @ApiProperty({
    description: 'The API key or secret to be stored',
    example: 'sk-abcdefghijklmnopqrstuvwxyz',
    format: 'password',
    minLength: 8,
  })
  @IsString({ message: 'Key must be a string' })
  @IsNotEmpty({ message: 'Key is required' })
  @MinLength(8, { message: 'Key must be at least 8 characters long' })
  key: string

  @ApiPropertyOptional({
    description: 'Additional metadata for the credential',
    example: { default_model: 'gpt-4', organization_id: 'org-123' },
    examples: [
      { default_model: 'gpt-4' },
      { default_model: 'claude-3-opus', temperature: 0.7 },
      { organization_id: 'org-123', default_model: 'command-r' }
    ],
    type: 'object',
    additionalProperties: true,
  })
  @IsObject({ message: 'Metadata must be an object' })
  @IsOptional()
  metadata?: Record<string, any>
}
