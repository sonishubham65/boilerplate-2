import { Module } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<SequelizeModuleOptions> => {
        return {
          dialect: 'postgres',
          name: 'postgres',
          username: configService.getConfig('database.postgres.user'),
          password: configService.getConfig('database.postgres.password'),
          database: configService.getConfig('database.postgres.database'),
          host: configService.getConfig('database.postgres.host'),
          port: configService.getConfig('database.postgres.port'),
          autoLoadModels: true,
          models: [__dirname + '/**/*.model.ts'],
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
export class DatabaseModule {}
