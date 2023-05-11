import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductModel, productProviders } from './product.model';
import { UserService } from '../user/user.service';
import { redisProvider } from '../database/redis.provider';
import {
  PRODUCT_REPOSITORY,
  REDIS_PROVIDER,
} from '../database/database.constant';

describe('ProductService', () => {
  let service: ProductService;
  let productModel: jest.Mocked<typeof ProductModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: {
            findOne: (obj) => {
              return {
                id: 1,
                name: 'Test',
              };
            },
          },
        },
        {
          provide: REDIS_PROVIDER,
          useValue: jest.fn(() => ({
            set: jest.fn((key: string, value: string) => `${key}:${value}`),
            get: jest.fn((key: string) => {
              return true;
            }),
          })),
        },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('GetProduct:', async () => {
    expect(service.getProduct).toBeDefined();
    const result = await service.getProduct(1);
    expect(Object.keys(result)).toEqual(['id', 'name']);
    expect(result.id).toBe(1);
  });
});
