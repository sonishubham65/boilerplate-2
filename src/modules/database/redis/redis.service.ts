import { Injectable } from '@nestjs/common';
import * as Redis from 'redis';
import { promisify } from 'util';

@Injectable()
export class RedisService {
  private readonly redisClient;

  constructor() {
    this.redisClient = Redis.createClient();
  }

  async set(key: string, value: string): Promise<void> {
    const setAsync = promisify(this.redisClient.set).bind(this.redisClient);
    await setAsync(key, value);
  }

  async get(key: string): Promise<string> {
    const getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    return await getAsync(key);
  }

  async delete(key: string): Promise<void> {
    const delAsync = promisify(this.redisClient.del).bind(this.redisClient);
    await delAsync(key);
  }

  async flush(): Promise<void> {
    const flushAsync = promisify(this.redisClient.flushdb).bind(
      this.redisClient,
    );
    await flushAsync();
  }
}
