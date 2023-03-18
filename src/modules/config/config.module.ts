import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from './config.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [ConfigService],
  exports: [ConfigService, JwtModule],
})
export class ConfigModule {}
