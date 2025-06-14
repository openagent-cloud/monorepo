import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString()
  subject: string

  @IsNotEmpty()
  @IsString()
  message: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>

  @IsString()
  tenantId: number
}
