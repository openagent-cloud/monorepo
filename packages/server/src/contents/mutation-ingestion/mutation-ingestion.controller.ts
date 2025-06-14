import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpException,
  UseGuards,
  Request
} from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger'
import { MutationIngestionService } from './mutation-ingestion.service'
import { MutationDto } from './dto/mutation.dto'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { JwtOnly, RequireModules } from '../../auth/decorators/auth-decorators'
import { module } from '@prisma/client'

/**
 * Controller for processing content mutations and data changes in the Electric Stack ecosystem.
 * Handles ingestion of data mutations from clients with proper validation and transaction tracking.
 */
@Controller('mutations')
@ApiTags('Content')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@JwtOnly()
@RequireModules(module.content)
export class MutationIngestionController {
  constructor(private readonly mutationIngestionService: MutationIngestionService) {}

  @Post('ingest')
  @ApiOperation({
    summary: 'Ingest mutations from client',
    description:
      'Process a batch of mutations from the client and return a transaction ID for tracking sync. ' +
      'Supports changes to content and content_type collections.'
  })
  @ApiBody({
    type: [MutationDto],
    description: 'Array of mutations to process',
    required: true
  })
  @ApiResponse({
    status: 201,
    description: 'Mutations successfully processed',
    schema: {
      properties: { success: { type: 'boolean' }, txid: { type: 'string' } }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid authentication required'
  })
  @ApiResponse({
    status: 500,
    description: 'Server error during mutation processing'
  })
  @ApiBadRequestResponse({
    description: 'Empty mutations array provided or invalid mutation format',
    schema: {
      properties: {
        message: { type: 'string' },
        error: { type: 'string' },
        statusCode: { type: 'number' }
      }
    }
  })
  async ingestMutations(@Body() mutations: MutationDto[], @Request() req: any) {
    // Validate that mutations array is not empty
    if (!mutations || mutations.length === 0) {
      throw new BadRequestException('Empty mutations array provided. No changes to persist.')
    }

    try {
      const result = await this.mutationIngestionService.processMutations(mutations, req.user)
      return { success: true, txid: result.txid }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      // For all other errors, return a 500 with the error message
      throw new HttpException(
        {
          status: 500,
          message: error.message || 'Internal server error',
          error: error.name || 'Error'
        },
        500
      )
    }
  }
}
