import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @HttpCode(HttpStatus.OK)
  @Get('error/:type')
  async error(@Param() param) {
    switch (parseInt(param.type)) {
      case 1:
        {
          throw new UnauthorizedException('You are not authenticated.');
        }
        break;
      case 2:
        {
          throw new ForbiddenException(
            'You are not authorised to perform this action.',
            {
              cause: new Error('Heheh'),
              description: 'Hello',
            },
          );
        }
        break;
      default:
        {
          throw new Error('Manual Error Generate, Unexpected.');
        }
        break;
    }
  }
}
