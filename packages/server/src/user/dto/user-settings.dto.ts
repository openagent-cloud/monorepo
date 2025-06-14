import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator'

export class UpdateUserSettingsDto {
  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name cannot be longer than 100 characters' })
  name?: string

  @ApiProperty({
    description: 'Unique username (3-30 characters, alphanumeric and underscores only)',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username cannot be longer than 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores'
  })
  username?: string

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string

  @ApiProperty({
    description: 'User bio/description',
    example: 'Artist and creator from NYC',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Bio cannot be longer than 500 characters' })
  bio?: string

  @ApiProperty({
    description: 'New password (minimum 8 characters)',
    example: 'newSecurePassword123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar_url?: string
}

export class UserSettingsResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  email: string

  @ApiProperty({
    description: 'Display name',
    example: 'John Doe',
    required: false,
  })
  name: string | null

  @ApiProperty({
    description: 'User bio',
    example: 'Artist and creator from NYC',
    required: false,
  })
  bio: string | null

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar_url: string | null

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'artist', 'moderator', 'admin', 'superadmin'],
  })
  role: string

  @ApiProperty({
    description: 'Whether the user is verified',
    example: true,
  })
  is_verified: boolean

  @ApiProperty({
    description: 'User public key for cryptographic operations',
    example: 'secp256k1_public_key_here',
    required: false,
  })
  public_key: string | null

  @ApiProperty({
    description: 'When the user was created',
    example: '2024-01-01T00:00:00Z',
  })
  created_at: Date

  @ApiProperty({
    description: 'When the user was last updated',
    example: '2024-01-01T00:00:00Z',
  })
  updated_at: Date
} 