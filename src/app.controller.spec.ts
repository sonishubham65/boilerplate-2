import { UnauthorizedException } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('AppController', () => {
  let appController: AppController;
  let health: HealthCheckService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, HealthCheckService, HttpHealthIndicator],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn(),
      })
      .overrideProvider(HttpHealthIndicator)
      .useValue({})
      .compile();

    appController = app.get<AppController>(AppController);
    health = app.get<HealthCheckService>(HealthCheckService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
    it('should return handle errors', (done) => {
      appController
        .error({ type: 1 })
        .catch((e) => {
          chai.expect(e).to.include.keys('response', 'status');
          chai
            .expect(e.response)
            .to.have.all.keys('message', 'error', 'statusCode');
        })
        .finally(() => {
          done();
        });
    });
    it('should return handle errors', (done) => {
      appController
        .error({ type: 2 })
        .catch((e) => {
          chai.expect(e).to.include.keys('response', 'status');
          chai
            .expect(e.response)
            .to.have.all.keys('message', 'error', 'statusCode');
        })
        .finally(() => {
          done();
        });
    });
    it('should return handle errors', (done) => {
      appController
        .error({ type: 3 })
        .catch((e) => {
          chai.expect(e).to.property('message');
          chai.expect(e.message).to.be.a('string');
        })
        .finally(() => {
          done();
        });
    });
  });

  describe('letsencrypt', () => {
    it('should be defined', () => {
      expect(appController.letsencrypt).toBeDefined();
    });
    it('should return a string', async () => {
      chai
        .expect(await appController.letsencrypt('OpWYPbiKSL'))
        .to.be.a('string');
    });
  });

  describe('check', () => {
    it('should be defined', () => {
      expect(appController.check).toBeDefined();
    });
    it('should return an object', async () => {
      jest.spyOn(health, 'check').mockResolvedValue({
        status: 'ok',
        info: { postgres: { status: 'up' } },
        error: {},
        details: { postgres: { status: 'up' } },
      });

      const response = await appController.check();
      console.log(response);
      chai.expect(response).to.all.keys('details', 'error', 'info', 'status');
    });
  });
});