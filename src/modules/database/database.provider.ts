import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '../config/config.service';
import { UserModel } from '../user/user.model';

const configService = new ConfigService();
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        username: configService.getConfig('databases.postgres.user'),
        password: configService.getConfig('databases.postgres.password'),
        database: configService.getConfig('databases.postgres.database'),
        host: configService.getConfig('databases.postgres.host'),
        port: configService.getConfig('databases.postgres.port'),
        // logging: (sql, timing) => {
        //   console.log(`SQL, timing`, sql, timing);
        // },
      });
      sequelize.addModels([UserModel]);
      return sequelize;
    },
  },
];
