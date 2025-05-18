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
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiQuery({
    name: 'blogId',
    required: false,
    type: String,
    description: 'Filter by blog ID',
  })
  @ApiResponse({ status: 200, description: 'Return all comments.' })
  async findAll(@Query('blogId') blogId?: string) {
    return await this.commentService.findAll({
      where: blogId ? { blog_id: blogId } : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Return the comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async findOne(@Param('id') id: string) {
    return await this.commentService.findOne({ id });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.update({ id }, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async remove(@Param('id') id: string) {
    return await this.commentService.remove({ id });
  }
}
