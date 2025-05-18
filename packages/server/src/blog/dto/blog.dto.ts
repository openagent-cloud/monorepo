import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ description: 'Blog title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Blog content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Publication status' })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({ description: 'Author ID' })
  @IsNotEmpty()
  author_id: number;
}

export class UpdateBlogDto {
  @ApiPropertyOptional({ description: 'Blog title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Blog content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Publication status' })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
