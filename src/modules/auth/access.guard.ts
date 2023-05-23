import { Global, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AccessGuard extends AuthGuard('access') {}

@Global()
@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private authService: AuthService, configService: ConfigService) {
    console.log(configService.getConfig('jwt'));
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
    console.log(`payload`, payload);
    return payload;
  }
}
