import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { response } from 'express';
import { AppService } from './app.service';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private dns: HttpHealthIndicator,
  ) {}

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

  @Get('.well-known/acme-challenge/:challenge')
  letsencrypt(@Param('challenge') challenge: string) {
    setTimeout(() => {
      console.log('1..');
    }, 0);
    console.log('2');
    Promise.resolve(10).then((data) => {
      console.log(`3`, data);
    });
    fs.readFile(
      '/Users/shubhamsoni/Documents/ecommerce/backend/certs/privkey.pem',

      (err, data) => {
        console.log('6', err, data);
      },
    );
    process.nextTick(() => {
      console.log(`5`);
    });
    setImmediate(() => {
      console.log('4..');
    });
    return 'OpWYPbiKSL-Mbuv62Eb5VlwHXN0_S-49jFfuQED2uwE.fxEtQayX3-AVdJvElbvaSIeclUIn0yJEBm2qNsm53eE';
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.dns.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
