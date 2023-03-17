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
          uri: configService.getConfig(`databases.postgres`),
          models: [],
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
export class DatabaseModule {}
