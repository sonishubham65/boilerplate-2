import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { REDIS_PROVIDER } from '../database/database.constant';
chai.use(chaiHttp);

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: {},
        },

        {
          provide: REDIS_PROVIDER,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
