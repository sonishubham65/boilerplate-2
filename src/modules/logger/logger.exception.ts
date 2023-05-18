import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { LoggerService } from './logger.service';

@Catch()
export class LoggerException implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    //const statusCode = exception.getStatus();

    const result = {
      data: {
        stack: exception.stack,
        cause: exception.cause,
        name: exception.name,
        response: exception.getResponse ? exception.getResponse() : undefined,
      },
      message: exception.message,
      statusCode: exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR,
    };

    this.logger.log('In Exception', result); // log original data

    const payload = {
      message: result.message,
    };

    if (result.statusCode == HttpStatus.INTERNAL_SERVER_ERROR) {
      payload['message'] = 'Something went wrong';
    }

    response.status(result.statusCode).json(payload);
  }
}
