import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as chalk from 'chalk';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
  private readonly requestId: string;

  constructor() {
    this.requestId = uuidv4();
  }

  private save(message: string, data?: object, type: string = '') {
    console.log(
      JSON.stringify({
        message,
        data,
        requestId: this.requestId,
        type,
      }),
    );
  }

  private getColor(type: string) {
    switch (type) {
      case 'info':
        return chalk.blue;
      case 'warning':
        return chalk.yellow;
      case 'debug':
        return chalk.green;
      case 'error':
        return chalk.red;
      default:
        return chalk.white;
    }
  }

  log(message: string, data?: object) {
    this.save(message, data);
  }

  info(message: string, data?: object) {
    this.save(message, data, 'info');
  }

  warn(message: string, data?: object) {
    this.save(message, data, 'warning');
  }

  debug(message: string, data?: object) {
    this.save(message, data, 'debug');
  }

  error(message: string, data?: object) {
    this.save(message, data, 'error');
  }
}
