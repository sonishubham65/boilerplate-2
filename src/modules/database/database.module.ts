import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { PostModel } from '../post/post.model';
import { UserModel } from '../user/user.model';
import {
  POSTGRES1,
  POSTGRES1FACTORY,
  REDIS_PROVIDER,
} from './database.constant';
import { redisProvider } from './redis.provider';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      name: POSTGRES1,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        console.log(
          'databases.postgres',
          configService.getConfig('databases.postgres'),
        );
        return {
          name: POSTGRES1,
          dialect: 'postgres',
          username: configService.getConfig('databases.postgres.user'),
          password: configService.getConfig('databases.postgres.password'),
          database: configService.getConfig('databases.postgres.database'),
          host: configService.getConfig('databases.postgres.host'),
          port: configService.getConfig('databases.postgres.port'),
          logging: (sql, timing) => {
            console.log(`SQL`, sql, timing['bind']);
          },
          pool: {
            acquire: 20000,
          },
          models: [UserModel, PostModel],
        };
      },
    }),
  ],
  providers: [redisProvider, RedisService],
  exports: [SequelizeModule, REDIS_PROVIDER],
})
export class DatabaseModule {}
