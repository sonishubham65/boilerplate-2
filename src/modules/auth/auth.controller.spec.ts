import { ExecutionContext, UseGuards } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('AuthController', () => {
  let controller: AuthController;
  let localGuard: LocalGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue({
        generate_token: () => {
          return {
            access_token: '',
            refresh_token: '',
          };
        },
        createUser: (data) => {
          return {
            id: 1,
            email: 'abc@exmaple.com',
            name: 'John Doe',
            status: 'active',
            emailVerified: true,
          };
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('signin', () => {
    const response = controller.signin(
      {
        user: {
          id: 1,
          email: 'abc@exmaple.com',
          name: 'John Doe',
          status: 'active',
          emailVerified: true,
        },
      },
      {
        email: 'abc@exmaple.com',
        password: 'Password!!',
      },
    );
    chai.expect(response).to.include.keys('message', 'data');
  });

  describe('FacebookLogin methods', () => {
    it('facebookLogin', () => {
      chai.expect(controller.facebookLogin()).to.be.equal(200);
    });

    it('facebookLoginCallback', () => {
      chai
        .expect(
          controller.facebookLoginCallback({
            user: {
              id: 1,
              email: 'abc@exmaple.com',
              name: 'John Doe',
              status: 'active',
              emailVerified: true,
            },
          }),
        )
        .to.include.keys('message', 'data');
    });
  });

  describe('Signup', () => {
    it('Signup defined', () => {
      expect(controller.signup).toBeDefined();
    });

    it('Signup functionality', async () => {
      const response = await controller.signup({
        email: 'abc@exmaple.com',
        name: 'John Doe',
        status: 'active',
        emailVerified: true,
      });
      chai.expect(response).to.include.keys('message');
    });
  });
});