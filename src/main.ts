import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';

process.env.NODE_CONFIG_STRICT_MODE = 'true';

async function bootstrap() {
  // Override with Secret manager.

  process.env.NODE_CONFIG =
    '{"application":{"url":{"backend":"http://localhost:3001"}}}';
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = app.get<ConfigService>(ConfigService);

  const whitelist = configService
    .getConfig('application.url.frontend')
    .split(',');
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    maxAge: 3600,
  });
  await app.listen(configService.getConfig('application.port'));
}
bootstrap();
