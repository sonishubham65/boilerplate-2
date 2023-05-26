import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { AccessGuard } from '../auth/access.guard';
import { LoggerService } from '../logger/logger.service';
import { PostDTO, IdDTO, PostQueryDTO } from './post.dto';
import PostModel from './post.model';
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
  @ApiBearerAuth()
  @ApiBody({
    type: PostDTO,
  })
  async create(@Body() body: PostDTO, @Req() req) {
    const post = await this.postService.create({
      ...body,
      userId: req.user.id,
    });

    return {
      message: 'A new post has been listed.',
      data: { postId: post.id },
    };
  }

  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  @ApiBearerAuth()
  @ApiQuery({
    type: PostQueryDTO,
  })
  async list(
    @Req() req,
    @Query() query,
  ): Promise<{ data: { posts: Array<Partial<PostModel>> } }> {
    const posts = await this.postService.list(
      req.user.id,
      query.order,
      query.page,
      query.limit,
    );

    return {
      data: {
        posts,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('detail/:id')
  async detail(
    @Param() param: IdDTO,
  ): Promise<{ data: { post: Partial<PostModel> } }> {
    const post = await this.postService.detail(param.id);
    return {
      data: {
        post: post,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: PostDTO,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @Put('update/:id')
  async update(
    @Req() req,
    @Param() param,
    @Body() body,
  ): Promise<{ message: string }> {
    const post = await this.postService.detail(param.id);
    if (post && post['userId'] == req.user.id) {
      const response = await this.postService.update(param.id, body);
      if (response && response[0] == 1) {
        return {
          message: 'The post has been updated.',
        };
      } else {
        throw new UnprocessableEntityException();
      }
    } else {
      throw new ForbiddenException();
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessGuard)
  @Delete('delete/:id')
  async delete(@Req() req, @Param() param): Promise<{ message: string }> {
    const post = await this.postService.detail(param.id);
    if (post && post['userId'] == req.user.id) {
      const response = await this.postService.delete(param.id);
      if (response) {
        return {
          message: 'The post has been delete.',
        };
      } else {
        throw new UnprocessableEntityException();
      }
    } else {
      throw new ForbiddenException();
    }
  }
}
