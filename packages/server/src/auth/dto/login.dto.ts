import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    description: 'Username or email used to login',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string

  @ApiProperty({
    description: 'User password',
    example: 'secretPassword123',
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
