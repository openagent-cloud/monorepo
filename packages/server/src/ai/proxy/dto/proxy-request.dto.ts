import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsObject } from 'class-validator'

export class ProxyRequestDto {
  @ApiProperty({
    description: 'The payload to send to the AI service',
    example: {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello!' },
      ],
    },
  })
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, any>
}
