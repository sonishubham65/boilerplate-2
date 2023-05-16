import { Module } from '@nestjs/common';
import { POST_REPOSITORY } from '../database/database.constant';
import { PostController } from './post.controller';
import { postProviders } from './post.model';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
