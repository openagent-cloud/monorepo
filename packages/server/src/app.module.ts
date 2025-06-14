import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from './utils/config/config.module'
import { PrismaModule } from './utils/prisma/prisma.module'
import { CredentialsModule } from './ai/credentials/credentials.module'
import { ProxyModule } from './ai/proxy/proxy.module'
import { AnalyticsModule } from './ai/analytics/analytics.module'
import { TenantsModule } from './tenants/tenants.module'
import { AgentsModule } from './ai/ai-agents/agents.module'
import { HttpLoggerMiddleware, LoggerModule } from './utils/logger'
import { FlowsModule } from './contents/flows/flows.module'
import { ContactModule } from './utils/contact/contact.module'
import { AuthModule } from './auth/auth.module'
import { ContentModule } from './contents/content/content.module'
import { ContentTypesModule } from './contents/content-types/content-types.module'
import { MailingListModule } from './utils/mailing-list/mailing-list.module'
import { MutationIngestionModule } from './contents/mutation-ingestion/mutation-ingestion.module'
import { UserModule } from './user/user.module'
import { AuthGuard } from './auth/guards/auth.guard'

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    PrismaModule,
    CredentialsModule,
    ProxyModule,
    AnalyticsModule,
    TenantsModule,
    AgentsModule,
    FlowsModule,
    ContactModule,
    AuthModule,
    ContentModule,
    ContentTypesModule,
    MailingListModule,
    MutationIngestionModule,
    UserModule
    // TenantModule removed - now using centralized auth
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply HTTP logger middleware to all routes
    consumer.apply(HttpLoggerMiddleware).forRoutes('*')
  }
}
