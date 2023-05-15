import { UserStatus } from '../user/user.model';

export class Signin {
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      name: string;
      status: UserStatus;
      emailVerified: Boolean;
    };
    tokens: {
      access_token: string;
      refresh_token: string;
    };
  };
}
