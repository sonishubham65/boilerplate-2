const config = require('config');
module.exports = {
  username: config.get('databases.postgres.user'),
  password: config.get('databases.postgres.password'),
  database: config.get('databases.postgres.database'),
  host: config.get('databases.postgres.host'),
  port: config.get('databases.postgres.port'),
  dialect: 'postgres',
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_meta',
  migrationStorageTableSchema: 'custom_schema',
  migrationStoragePath: 'sequelizeMeta.json',
  logging: true,
};
