import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { UserStatus } from '../user/user.model';
chai.use(chaiHttp);

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService, ConfigService],
    })
      .overrideProvider(UserService)
      .useValue({
        get_user_with_email: jest.fn(),
      })
      .overrideProvider(JwtService)
      .useClass(JwtService)
      .overrideProvider(ConfigService)
      .useClass(ConfigService)
      .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser', async () => {
    const spy = jest
      .spyOn(userService, 'get_user_with_email')
      .mockImplementation((email: string) => {
        return Promise.resolve({
          id: 1,
          email: email,
          name: 'John Doe',
          password:
            '$2b$10$i9FzQX6P.XD6o3VF/A1cG.XXdE7jsQpwmOyswgliC2xGhGI81mmeC',
          status: UserStatus.active,
          emailVerified: true,
        }) as any;
      });

    const response = await service.validateUser(
      'abc@example.com',
      'Password!!',
    );

    expect(spy).toHaveBeenCalledWith('abc@example.com');
    chai.expect(response).to.include.keys('user', 'success');
    chai
      .expect(response.user)
      .to.all.keys('id', 'email', 'name', 'status', 'emailVerified');
  });
});
