import { OpenAI } from 'openai'
import { setDefaultOpenAIClient, setOpenAIAPI } from '@openai/agents'
import { Module, OnModuleInit } from '@nestjs/common'
import { PrismaModule } from '../../utils/prisma/prisma.module'
import { ConfigService } from '../../utils/config/config.service'
import { LoggerService } from '../../utils/logger/logger.service'
import { LoggerModule } from '../../utils/logger/logger.module'
import { AgentsService } from './agents.service'
import { AgentsController } from './agents.controller'

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [AgentsController],
  providers: [AgentsService, ConfigService, LoggerService],
  exports: [AgentsService]
})
export class AgentsModule implements OnModuleInit {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('AgentsModule')
  }

  onModuleInit() {
    this.logger.log('🤖 AgentsModule initialized')
    // const customClient = new OpenAI({
    //   baseURL: '...', // Use our proxy
    //   apiKey: '...' // Pull from tenant id/secret
    // })
    // setDefaultOpenAIClient(customClient)
    setOpenAIAPI('chat_completions') //or 'responses'
  }
}
