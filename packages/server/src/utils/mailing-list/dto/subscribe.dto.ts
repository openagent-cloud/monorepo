import { IsEmail, IsInt, IsObject, IsOptional, IsString } from 'class-validator'

export class SubscribeDto {
  @IsEmail()
  email: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>

  @IsString()
  @IsOptional()
  source?: string

  @IsInt()
  tenantId: number
}
