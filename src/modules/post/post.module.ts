import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger/logger.module';
import { PostController } from './post.controller';
import { postProviders } from './post.model';
import { PostService } from './post.service';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [PostController],
  providers: [PostService, ...postProviders],
  exports: [],
})
export class PostModule {}
