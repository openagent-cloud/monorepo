import { Module } from '@nestjs/common'
import { CredentialService } from './credential.service'
import { CredentialController } from './credential.controller'

@Module({
  providers: [CredentialService],
  controllers: [CredentialController],
  exports: [CredentialService],
})
export class CredentialModule {}
