import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '../utils/config/config.service'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaModule } from '../utils/prisma/prisma.module'
import { ConfigModule } from '../utils/config/config.module'
import { JwtStrategy } from './strategies/jwt.strategy'
// Using absolute path to fix TypeScript import resolution
import { ApiKeyStrategy } from 'src/auth/strategies/api-key.strategy'
import { AuthGuard } from './guards/auth.guard'
import { OptionalAuthMiddleware } from './middleware/optional-auth.middleware'
import { TokenService } from './services/token.service'
import { CryptoService } from './services/crypto.service'

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '1h' } // Hardcoded JWT expiration time
      })
    })
  ],
  providers: [AuthService, TokenService, JwtStrategy, ApiKeyStrategy, AuthGuard, CryptoService],
  controllers: [AuthController],
  exports: [AuthService, TokenService, AuthGuard]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OptionalAuthMiddleware).forRoutes('*path')
  }
}
