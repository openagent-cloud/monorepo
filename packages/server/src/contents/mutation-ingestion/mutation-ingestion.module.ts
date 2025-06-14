import { Module } from '@nestjs/common'
import { MutationIngestionController } from './mutation-ingestion.controller'
import { MutationIngestionService } from './mutation-ingestion.service'
import { PrismaModule } from '../../utils/prisma/prisma.module'

/**
 * @module MutationIngestionModule
 *
 * @description
 * Processes content mutation operations for the Electric Stack.
 * This module handles the processing of data mutations for content and content types,
 * serving as a central point for consistent data changes across the application.
 *
 * Features:
 * - Content mutations: Create, update, delete operations for content entries
 * - Content type mutations: Schema and metadata changes for content types
 * - Transaction support: Groups related mutations with transaction IDs
 *
 * Dependencies:
 * - PrismaModule: For database operations using the Electric SQL protocol
 */
@Module({
  imports: [PrismaModule],
  controllers: [MutationIngestionController],
  providers: [MutationIngestionService],
  exports: [MutationIngestionService]
})
export class MutationIngestionModule {}
