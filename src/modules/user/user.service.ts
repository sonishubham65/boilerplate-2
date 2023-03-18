import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserModel, UserStatus } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userModel: typeof UserModel,
  ) {}

  async get_user_with_email(email: string): Promise<UserModel> {
    const user = await this.userModel.findOne({
      attributes: ['id', 'email', 'password', 'status', 'emailVerified'],
      where: {
        email,
      },
    });
    return user?.toJSON();
  }

  async get_user_by_id(id: number): Promise<UserModel> {
    const user = await this.userModel.findOne({
      attributes: ['id', 'email', 'password', 'status', 'emailVerified'],
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
    try {
      if (await this.get_user_with_email(data.email)) {
        throw new UnprocessableEntityException("You're already registered.");
      }
      const user = UserModel.build(data);
      return await user.save();
    } catch (e) {
      if (
        e.parent?.code == 23505 &&
        e.parent?.constraint == 'users_email_key'
      ) {
        throw new UnprocessableEntityException("You're already registered.");
      } else {
        throw e;
      }
    }
  }
}
