import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard error response DTO
 * Used for consistent error responses across the API
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized - Invalid API key',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Unauthorized',
    type: String,
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Timestamp of when the error occurred',
    example: '2025-05-18T06:58:43.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  timestamp?: string;

  @ApiProperty({
    description: 'Request path that caused the error',
    example: '/credentials',
    type: String,
    required: false,
  })
  path?: string;
}
