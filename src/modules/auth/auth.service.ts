import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import UserModel, { UserStatus } from '../user/user.model';
const ms = require('ms');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.get_user_with_email(email);
    if (!user) {
      return { success: false, code: 'USER_NOTFOUND' };
    } else {
      if (user.status !== UserStatus.active) {
        return { user, success: false, code: 'STATUS_INACTIVE' };
      }
      if (password) {
        const compare = await bcrypt.compare(password, user.password);
        if (compare) {
          return { user, success: true };
        } else {
          return { success: false, code: 'PASSWORD_MISMATCH' };
        }
      } else {
        return { success: true, user, code: 'PASSWORD_NOTCOMPARED' };
      }
    }
  }

  generate_token(payload) {
    const token = this.configService.getConfig(`jwt.token`);

    return {
      access_token: this.jwtService.sign(payload, {
        secret: token,
        expiresIn: ms(this.configService.getConfig(`jwt.expiry.access`)),
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: token,
        expiresIn: ms(this.configService.getConfig(`jwt.expiry.refresh`)),
      }),
    };
  }

  async generate_hash(string, saltRounds = 10) {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(string, salt);
  }

  async createUser(user) {
    if (user.password) user.password = await this.generate_hash(user.password);
    return await this.userService.create_user(user);
  }

  async validate(userId): Promise<boolean> {
    const user = await this.userService.get_user_by_id(userId);
    if (user.status !== UserStatus.active) {
      return false;
    }
    return true;
  }

  async get_user_with_email(email): Promise<UserModel> {
    return this.userService.get_user_with_email(email);
  }
}
