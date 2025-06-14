import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator'

export class PasswordResetConfirmDto {
  @ApiProperty({
    description: 'The reset token received by email',
    example: 'abcdef123456',
  })
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty({
    description: 'New password for the account',
    example: 'NewSecurePassword123!',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  password: string
}
