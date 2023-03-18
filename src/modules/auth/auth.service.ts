import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { UserStatus } from '../user/user.model';

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
      return false;
    } else {
      if (await bcrypt.compare(password, user.password)) {
        return false;
      } else {
        return user;
      }
    }
  }

  generate_token(payload) {
    const token = this.configService.getConfig(`jwt.token`);

    return {
      access_token: this.jwtService.sign(payload, {
        secret: token,
        expiresIn: this.configService.getConfig(`jwt.expiry.access`),
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: token,
        expiresIn: this.configService.getConfig(`jwt.expiry.refresh`),
      }),
    };
  }

  async createUser(user) {
    return await this.userService.create_user(user);
  }

  async validate(userId): Promise<boolean> {
    const user = await this.userService.get_user_by_id(userId);
    if (user.status !== UserStatus.active) {
      return false;
    }
    return true;
  }
}
