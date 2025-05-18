import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { PrismaModule } from './prisma/prisma.module'
import { CredentialModule } from './credential/credential.module'
import { TenantModule } from './tenant/tenant.module'
import { LoggerModule } from './logger'
import { HttpLoggerMiddleware } from './logger/http-logger.middleware'

@Module({
  imports: [LoggerModule, ConfigModule, PrismaModule, CredentialModule, TenantModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply HTTP logger middleware to all routes
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
