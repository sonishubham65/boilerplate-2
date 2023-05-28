import {
  ConflictException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_PROVIDER, USER_REPOSITORY } from '../database/database.constant';
import { UserModel, UserStatus } from './user.model';
import * as moment from 'moment';
import { LoggerService } from '../logger/logger.service';
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userModel,
    @Inject(REDIS_PROVIDER) private cacheManager: Redis,
  ) {}

  async get_user_with_email(email: string) {
    return await this.userModel.findOne({
      attributes: [
        'id',
        'email',
        'name',
        'password',
        'status',
        'emailVerified',
      ],
      where: {
        email,
      },
    });
  }

  async get_user_by_id(id: number): Promise<UserModel> {
    const user = await this.userModel.findOne({
      attributes: [
        'id',
        'email',
        'password',
        'name',
        'status',
        'emailVerified',
      ],
      where: {
        id,
      },
    });
    return user?.toJSON();
  }

  async create_user(
    data: Partial<UserModel>,
    status: UserStatus = UserStatus.inactive,
  ): Promise<UserModel> {
    data.status = status;

    const userKey = `USER_CREATE_${data.email}`;
    const user = UserModel.build(data);

    if (!(await this.cacheManager.get(userKey))) {
      const lock = await this.cacheManager.setnx(userKey, moment().unix());
      if (lock) {
        return await user.save();
      } else {
        throw new ConflictException(
          'Someone else has already aquired lock for the same Email.',
        );
      }
    } else {
      throw new UnprocessableEntityException('Duplicate Email address');
    }
  }
}
