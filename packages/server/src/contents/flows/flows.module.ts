import { Module } from '@nestjs/common'
import { FlowController } from './flows.controller'
import { FlowService } from './flows.service'
import { PrismaService } from '../../utils/prisma/prisma.service'

@Module({
  imports: [],
  controllers: [FlowController],
  providers: [FlowService, PrismaService],
  exports: [FlowService]
})
export class FlowsModule {}
