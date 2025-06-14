import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: 'Email or username to identify the account for password reset',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string
}
