import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { version } from 'os';
import { AccessGuard } from '../auth/access.guard';
import { FacebookGuard } from '../auth/facebook.guard';
import { LocalGuard } from '../auth/local.guard';
import { PostService } from './post.service';

@Controller({
  path: 'post',
  version: '1',
})
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body) {
    const post = await this.postService.create(body);

    return {
      message: 'A new post has been listed.',
      data: { post },
    };
  }
}
