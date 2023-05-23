import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { UserModel, UserStatus } from '../user/user.model';

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
  ): Promise<any> {
    const { name, emails } = profile;

    const facebookuser: Partial<UserModel> = {
      email: emails[0].value,
      name: [name.givenName, name.familyName].join(' '),
      status: UserStatus.active,
      emailVerified: true,
    };

    const user = await this.authService.get_user_with_email(facebookuser.email);

    console.log(`user==>`, user);
      
    if (user) {
      let response = await this.authService.validateUser(user.email, '');
      done(null, user);
    } else {
      const response = await this.authService.createUser(facebookuser);
      done(null, response);
    }
  }

  // async validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: any,
  //   done: any,
  // ): Promise<any> {
  //   const { name, emails, id } = profile;
  //   const user = {
  //     email: emails[0].value,
  //     firstName: name.givenName,
  //     lastName: name.familyName,
  //     facebookId: id,
  //     accessToken,
  //     refreshToken,
  //   };

  //   /*
  //   // further validation with DB/Redis
  //   const validatedUser = await this.authService.validateOAuthLogin(user);
  //   if (!validatedUser) {
  //     return done(null, false);
  //   }
  //   done(null, validatedUser);
  //   */
  //   console.log(`user`, user);
  //   done(null, user);
  // }
}
