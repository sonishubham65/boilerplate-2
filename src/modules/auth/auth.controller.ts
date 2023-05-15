import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '../config/config.service';
import { Signin } from './auth.dto';
import { AuthService } from './auth.service';
import { FacebookGuard } from './facebook.guard';
import { LocalGuard } from './local.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Version('1')
  @UseGuards(FacebookGuard)
  @Get('/facebook')
  async facebookLogin(@Req() req: Request, @Res() res: Response) {
    return HttpStatus.OK;
  }

  @Version('1')
  @UseGuards(FacebookGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/facebook/callback')
  async facebookLoginCallback(@Request() req, @Body() body): Promise<Signin> {
    const tokens = this.authService.generate_token(req.user);
    return {
      message: 'Logged in successfully',
      data: {
        user: req.user,
        tokens,
      },
    };
  }

  /**
   *
   * @param req
   * @param body
   * @description signin user and return user, access_token and refresh_token
   * @returns
   */
  @Version('1')
  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(@Request() req, @Body() body): Promise<Signin> {
    // TODO: Get user Profile, Roles, Permissions, for now considering the req.user only
    const tokens = this.authService.generate_token(req.user);
    return {
      message: 'You are logged in successfully.',
      data: {
        user: req.user,
        tokens: tokens,
      },
    };
  }

  /**
   *
   * @param req
   * @param body
   * @description signup user and return true
   * @returns
   */
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signup(@Request() req, @Body() body) {
    const userId = await this.authService.createUser(body);
    // TODO: Send Email for verification.
    return {
      message: 'You are registered successfully.',
    };
  }
}
