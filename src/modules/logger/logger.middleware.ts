import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('Incoming Request', {
      body: req.body,
      headers: req.headers,
      queries: req.query,
      params: req.params,
    });
    next();
  }
}
