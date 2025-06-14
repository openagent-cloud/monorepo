import { Module } from '@nestjs/common';
import { MailingListService } from './mailing-list.service';
import { MailingListController } from './mailing-list.controller';

/**
 * @module MailingListModule
 * 
 * @description
 * Manages mailing list subscriptions within the Electric Stack.
 * This module handles the collection, management, and retrieval of
 * email subscriptions for marketing and notification purposes.
 * 
 * Features:
 * - Email subscription management
 * - Subscriber metadata collection and storage
 * - Subscription source tracking
 * - Unsubscribe functionality
 * - Subscriber listing with sorting options
 * 
 * Uses PrismaService from PrismaModule indirectly through its service
 * for database operations following Electric SQL protocol.
 */
@Module({
  controllers: [MailingListController],
  providers: [MailingListService],
  exports: [MailingListService],
})
export class MailingListModule {}
