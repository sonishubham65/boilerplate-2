import { Inject, Injectable } from '@nestjs/common';
import { Order, Sequelize, WhereOptions } from 'sequelize';
import { POST_REPOSITORY } from '../database/database.constant';
import { LoggerService } from '../logger/logger.service';
import { PostModel } from './post.model';

@Injectable()
export class PostService {
  constructor(
    private logger: LoggerService,
    @Inject(POST_REPOSITORY)
    private postModel: typeof PostModel,
  ) {}
  async create(post: Partial<PostModel>) {
    return await this.postModel.create(post, {
      returning: ['id'],
    });
  }

  async list(
    userId: number,
    order,
    page: number,
    limit: number,
  ): Promise<PostModel[]> {
    console.log(page, limit);
    return await this.postModel.findAll({
      where: {
        userId: userId,
      },
      order: [],
      attributes: ['id', 'title', 'status'],
      limit: limit,
      offset: (page - 1) * limit,
    });
  }

  async detail(id): Promise<PostModel> {
    return await this.postModel.findOne({
      where: {
        id,
      },
      attributes: [
        'id',
        'title',
        'description',
        'userId',
        'status',
        'version',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async update(id, data): Promise<any> {
    return await this.postModel.update(data, {
      where: {
        id,
      },
    });
  }

  async delete(id): Promise<any> {
    return await this.postModel.destroy({
      where: { id },
    });
  }
}
