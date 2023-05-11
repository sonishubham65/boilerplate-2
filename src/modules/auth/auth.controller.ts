import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

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
  async signin(@Request() req, @Body() body) {
    console.log(req.headers);
    // TODO: Get user Profile, Roles, Permissions, for now considering the req.user only
    delete req.user.password;
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
