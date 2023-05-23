import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';
import { faker } from '@faker-js/faker';
import axios from 'axios';
process.env.NODE_CONFIG_STRICT_MODE = 'true';

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
  await app.listen(configService.getConfig('application.port'));
}
bootstrap();

/**
 * Fakerjs: generate some fake data
 */
const fakeData = async () => {
  for (let i = 0; i < 5000000; i++) {
    try {
      // await axios
      //   .post('http://localhost:3000/v1/auth/signup', {
      //     name: faker.name.fullName(),
      //     email: faker.internet.email(),
      //     password: faker.internet.password(),
      //   })
      //   .then((response) => {})
      //   .catch((e) => {
      //     console.log('failre', e.message);
      //   });

      await axios
        .post(
          'http://localhost:3000/v1/post',
          {
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            status: 'active',
          },
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzb25pc2h1YmhhbTY1QGdtYWlsLmNvbSIsIm5hbWUiOiJTaHViaGFtIFNvbmkiLCJwYXNzd29yZCI6bnVsbCwic3RhdHVzIjoiaW5hY3RpdmUiLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNjg0MTQzNTk3LCJleHAiOjE2ODcxNDM1OTd9.r8lXoTnm_f1JrNvd9pyk47Q70AE_maX98iuwYhr1ulM`,
            },
          },
        )
        .then((response) => {
          //console.log(response.data);
        })
        .catch((e) => {
          console.log('failre', e.message);
        });
    } catch (e) {
      console.log('failre', e.message);
    }
  }
};
//fakeData();