import { Injectable } from '@nestjs/common';

export const enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
}

@Injectable()
export class UserService {
  async get_user_with_email(email: string): Promise<User> {
    return {
      id: 1,
      name: 'Shubham',
      email: 'shubham@gmail.com',
      password: 'xxxxxx',
      status: UserStatus.active,
    };
  }

  async get_user_by_id(id: number): Promise<User> {
    return {
      id: 1,
      name: 'Shubham',
      email: 'shubham@gmail.com',
      password: 'xxxxxx',
      status: UserStatus.active,
    };
  }

  async create_user(
    user,
    status: UserStatus = UserStatus.inactive,
  ): Promise<number> {
    // TODO: Create a user in DB and share insert id
    return 1;
  }
}
