import { ApiProperty } from '@nestjs/swagger';
import { AdapterType } from '@prisma/client';


/**
 * Credential response DTO
 * Used for returning credential information without sensitive data
 */
export class CredentialResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the credential',
    example: 'cred_01h9xgsvs3kqb6qj6zd9kh7qpz',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Service this credential is for',
    example: 'openai',
    enum: Object.values(AdapterType),
    enumName: 'AdapterType',
  })
  service: AdapterType;

  @ApiProperty({
    description: 'Additional metadata for the credential',
    example: { default_model: 'gpt-4' },
    type: 'object',
    additionalProperties: true,
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'When the credential was created',
    example: '2025-05-18T06:58:43.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the credential was last updated',
    example: '2025-05-18T06:58:43.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  updatedAt?: Date;
}
