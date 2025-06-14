import { Module } from '@nestjs/common'
import { ContentService } from './content.service'
import { ContentController } from './content.controller'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { ContentTypesService } from '../content-types/content-types.service'

@Module({
  controllers: [ContentController],
  providers: [ContentService, PrismaService, ContentTypesService],
  exports: [ContentService]
})
export class ContentModule {}
