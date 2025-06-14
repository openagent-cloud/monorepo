import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, IsPositive } from 'class-validator'

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: 'Username for login and display',
    example: 'cooluser123',
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({
    description: 'User password',
    example: 'secretPassword123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'Tenant ID the user belongs to',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  tenant_id: number
}
