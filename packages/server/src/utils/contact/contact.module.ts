import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

/**
 * @module ContactModule
 * 
 * @description
 * Handles contact form submissions and management for the Electric Stack.
 * This module provides endpoints for submitting and managing contact messages
 * from users, with support for categorization and status tracking.
 * 
 * Features:
 * - Contact message submission and storage
 * - Message categorization by type (support, sales, etc.)
 * - Status tracking (new, read, responded, archived)
 * - Message filtering by category
 * - Support for additional metadata collection
 * 
 * Uses PrismaService from PrismaModule indirectly through its service
 * for database operations following Electric SQL protocol.
 */
@Module({
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
