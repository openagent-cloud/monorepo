import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Blog ID' })
  @IsString()
  @IsNotEmpty()
  blog_id: string;

  @ApiProperty({ description: 'Author ID' })
  @IsNotEmpty()
  author_id: number;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: 'Comment content' })
  @IsString()
  @IsOptional()
  content?: string;
}
