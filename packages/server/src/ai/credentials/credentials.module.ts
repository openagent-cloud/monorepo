import { Module } from '@nestjs/common'
import { CredentialsService } from './credentials.service'
import { CredentialsController } from './credentials.controller'
import { LoggerModule } from '../../utils/logger'

@Module({
  imports: [LoggerModule],
  providers: [CredentialsService],
  controllers: [CredentialsController],
  exports: [CredentialsService]
})
export class CredentialsModule {}
