import {
  Module,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { REQUEST, ContextIdFactory, ModuleRef } from '@nestjs/core';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        if (typeof data === 'object') {
          data.executionTime = Date.now() - now;
          data.requestId = this.logger.requestId;
          const response = context.switchToHttp().getResponse();
        }
        this.logger.log(`Response Interceptor`, data);
      }),
    );
  }
}
