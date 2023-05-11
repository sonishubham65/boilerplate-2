import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import UserModel from './user.model';
export const AuthUser = createParamDecorator<UserModel>(
  (data: object, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
