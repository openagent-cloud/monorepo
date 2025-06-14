import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class PasswordResetRequestDto {
  @ApiProperty({
    description: 'Email or username of the user requesting password reset',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string
}
