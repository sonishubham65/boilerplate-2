import { Global, Module, Scope } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerException } from './logger.exception';
import { LoggerInterceptor } from './logger.interceptor';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: LoggerException,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
