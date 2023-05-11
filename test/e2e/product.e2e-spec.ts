import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { expect } from 'chai';

describe('Cats', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET Products`, () => {
    return request(app.getHttpServer())
      .get('/product')
      .set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzaHViaGFtLnNvbmlAbWF2cS5jb20iLCJzdGF0dXMiOiJpbmFjdGl2ZSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE2ODEzOTEyODgsImV4cCI6MTY4NDM5MTI4OH0.2uJxKCHMB7HuP9I8pz9vyHefTBQ8Kf2AxLntI8Dr_Z4`,
      )
      .expect(200)
      .expect((response) => {
        expect(response.body).to.be.an('object');
        expect(response.body.data).to.be.an('object');
        expect(response.body.data.products).to.be.an('array');
      });
  });

  afterAll(async () => {
    //await app.close();
  });
});
