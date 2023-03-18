import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AccessGuard extends AuthGuard('access') {}

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private authService: AuthService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getConfig('jwt.token'),
      signOptions: {
        expiresIn: configService.getConfig('jwt.expiry.access'),
      },
    });
  }

  async validate(payload: any) {
    if (await this.authService.validate(payload.id)) {
      throw new UnauthorizedException();
    }
  }
}
