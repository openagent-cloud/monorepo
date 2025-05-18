import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'The blog post has been created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiQuery({
    name: 'published',
    required: false,
    type: Boolean,
    description: 'Filter by publication status',
  })
  @ApiResponse({ status: 200, description: 'Return all blog posts.' })
  async findAll(@Query('published') published?: string) {
    return this.blogService.findAll({
      where: published ? { published: published === 'true' } : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({ status: 200, description: 'Return the blog post.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne({ id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({
    status: 200,
    description: 'The blog post has been updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update({ id }, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({
    status: 200,
    description: 'The blog post has been deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async remove(@Param('id') id: string) {
    return this.blogService.remove({ id });
  }
}
