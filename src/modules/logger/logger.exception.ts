import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from './logger.service';

@Catch()
export class LoggerException implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = exception.getStatus();

    this.logger.log('In Exception', {
      msg: exception.message,
      code: exception.stack,
    });

    if (
      [
        'UnprocessableEntityException',
        'ForbiddenException',
        'ConflictException',
        'NotFoundException',
        'UnauthorizedException',
        'HttpException',
        'ForbiddenException',
      ]
    ) {
    } else {
    }

    return {
      status,
    };
  }
}
