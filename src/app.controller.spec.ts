import { UnauthorizedException } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, HealthCheckService, HttpHealthIndicator],
    })
      .overrideProvider(HealthCheckService)
      .useValue({})
      .overrideProvider(HttpHealthIndicator)
      .useValue({})
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return handle errors', (done) => {
      appController
        .error({ type: 1 })
        .catch((e) => {
          expect(e).to.include.keys('response', 'status');
          expect(e.response).to.have.all.keys('message', 'error', 'statusCode');
        })
        .finally(() => {
          done();
        });
    });
    it('should return handle errors', (done) => {
      appController
        .error({ type: 2 })
        .catch((e) => {
          expect(e).to.include.keys('response', 'status');
          expect(e.response).to.have.all.keys('message', 'error', 'statusCode');
        })
        .finally(() => {
          done();
        });
    });
    it('should return handle errors', (done) => {
      appController
        .error({ type: 3 })
        .catch((e) => {
          console.log(e);
          expect(e).to.property('message');
          expect(e.message).to.be.a('string');
        })
        .finally(() => {
          done();
        });
    });
  });
});

/**
 * "message","statusCode","error"
 */
