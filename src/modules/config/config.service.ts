import { Injectable } from '@nestjs/common';
import { IConfig } from 'config';

@Injectable()
export class ConfigService {
  private config: IConfig;
  constructor() {
    this.config = require('config');
  }
  getConfig(configKey: string) {
    return this.config.get(configKey);
  }
}
