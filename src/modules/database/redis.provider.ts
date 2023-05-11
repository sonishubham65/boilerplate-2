import { Provider } from '@nestjs/common';
import ioredis from 'ioredis';
import { ConfigService } from '../config/config.service';
import { REDIS_PROVIDER } from './database.constant';
export const redisProvider: Provider = {
  provide: REDIS_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const client = new ioredis(configService.getConfig('databases.redis.url'));
    return client;
  },
  inject: [ConfigService],
};
