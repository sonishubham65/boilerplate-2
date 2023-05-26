import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './modules/logger/logger.middleware';

describe('AppModule', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  describe('Module', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
  });

  describe('Controller', () => {
    let appController: AppController;

    beforeEach(() => {
      appController = app.get<AppController>(AppController);
    });

    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });

  describe('Service', () => {
    let appService: AppService;

    beforeEach(() => {
      appService = app.get<AppService>(AppService);
    });

    it('should be defined', () => {
      expect(appService).toBeDefined();
    });
  });
});
