import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
