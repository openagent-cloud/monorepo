import { ApiProperty } from '@nestjs/swagger'

export class TenantResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the tenant',
    example: '01h9xgsvs3kqb6qj6zd9kh7qpz',
  })
  id: string

  @ApiProperty({
    description: 'Name of the tenant',
    example: 'Acme Corporation',
  })
  name: string

  @ApiProperty({
    description: 'API key for the tenant',
    example: 'tnnt_01h9xgsvs3kqb6qj6zd9kh7qpz',
  })
  apiKey: string

  @ApiProperty({
    description: 'Timestamp when the tenant was created',
    example: '2023-09-15T12:00:00.000Z',
  })
  createdAt: Date
}
