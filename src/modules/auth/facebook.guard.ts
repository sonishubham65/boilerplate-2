import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { UserModel, UserStatus } from '../user/user.model';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class FacebookGuard extends AuthGuard('facebook') {
  constructor(private configService: ConfigService) {
    super();
  }
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService, private authService: AuthService) {
    const config = {
      clientID: configService.getConfig('idp.facebook.appId'),
      clientSecret: configService.getConfig('idp.facebook.secret'),
      callbackURL: configService.getConfig('idp.facebook.callbackurl'),
      scope: ['email, public_profile'],
      profileFields: [
        'id',
        'displayName',
        'name',
        'gender',
        'picture.type(large)',
        'email',
      ],
    };
    super(config);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const { name, emails } = profile;

    const facebookuser: Partial<UserModel> = {
      email: emails[0].value,
      name: [name.givenName, name.familyName].join(' '),
      status: UserStatus.active,
      emailVerified: true,
    };

    let user = await this.authService.get_user_with_email(facebookuser.email);

    console.log(`user==>`, user);

    if (!user) {
      user = await this.authService.createUser(facebookuser, UserStatus.active);
    }

    const { success, code } = await this.authService.validateUser(
      user.email,
      '',
    );
    if (success) done(null, user);
    else
      done({ cause: code, statusCode: 401, message: 'Unauthentication' }, {});
  }
}
