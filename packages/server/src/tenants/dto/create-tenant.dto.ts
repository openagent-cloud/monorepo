import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateTenantDto {
  @ApiProperty({
    description: 'Name of the tenant',
    example: 'Acme Corporation',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @ApiProperty({
    description: 'Contact email for the tenant',
    example: 'contact@acme.com',
    required: false,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  contactEmail?: string
}
