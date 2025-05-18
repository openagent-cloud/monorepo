import { Module } from '@nestjs/common'
import { TenantController } from './tenant.controller'
import { TenantService } from './tenant.service'
import { PrismaModule } from '../prisma/prisma.module'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule { }
