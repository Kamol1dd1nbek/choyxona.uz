import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import {
  RefreshTokenFromBearerStrategy,
  RefreshTokenFromCookieStrategy,
} from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../common/guards';

@Module({
  imports: [PrismaModule, RedisModule, MailModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenFromBearerStrategy,
    RefreshTokenFromCookieStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
  ],
})
export class AuthModule {}
