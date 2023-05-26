process.env.NODE_CONFIG_STRICT_MODE = 'true';

import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Override with Secret manager.

  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const configService = app.get<ConfigService>(ConfigService);

  const whitelist = configService
    .getConfig('application.url.cors')
    .split(',')
    .map((url) => url.trim());
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

  const config = new DocumentBuilder()
    .setTitle('POC demonstration')
    .setDescription('The POC demonstration description')
    .addBearerAuth({
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .setVersion('1.0')
    .addTag('poc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(configService.getConfig('application.port'));
}
bootstrap();

/**
 * Fakerjs: generate some fake data
 */
const fakeData = async () => {
  for (let i = 0; i < 5000000; i++) {
    try {
      await axios
        .post('http://localhost:3000/v1/auth/signup', {
          name: faker.name.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .then((response) => {})
        .catch((e) => {
          console.log('failre', e.message);
        });
    } catch (e) {
      console.log('failre', e.message);
    }
  }
};
//fakeData();
