import { Module } from '@nestjs/common'
import { TenantsController } from './tenants.controller'
import { TenantsService } from './tenants.service'
import { PrismaModule } from '../utils/prisma/prisma.module'
import { ConfigModule } from '../utils/config/config.module'

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService]
})
export class TenantsModule {}
