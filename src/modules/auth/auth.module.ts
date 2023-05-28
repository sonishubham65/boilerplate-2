import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AccessStrategy } from './access.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.guard';
import { FacebookStrategy } from './facebook.guard';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [DatabaseModule, UserModule, LoggerModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    FacebookStrategy,
    JwtService,
    AccessStrategy,
    LoggerService,
  ],
  exports: [AccessStrategy],
})
export class AuthModule {}
