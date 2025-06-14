import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ResetPasswordConfirmDto {
  @ApiProperty({
    description: 'Reset token received in email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string
}
