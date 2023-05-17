import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from './modules/config/config.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [DatabaseModule, ConfigModule, UserModule, AuthModule, PostModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
