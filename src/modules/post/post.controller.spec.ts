import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    })
      .overrideProvider(PostService)
      .useValue({
        detail: jest.fn(),
      })
      .compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Detail API function', () => {
    it('should return an object of details', async () => {
      const detail: any = {
        id: 27,
        title: 'Nike Invincible 3',
        description:
          "With maximum cushioning to support every mile, the Invincible 3 gives you our highest level of comfort underfoot to help you stay on your feet today, tomorrow and beyond. Designed to help keep you on the run, it's super supportive and bouncy, so that you can propel down your preferred path and come back for your next run feeling ready and reinvigorated.",
        userId: 1,
        status: 'active',
        version: 0,
        createdAt: '2023-05-16T02:15:48.161Z',
        updatedAt: '2023-05-16T02:15:48.088Z',
      };

      const expectedResult = {
        data: {
          post: detail,
        },
      };

      jest.spyOn(service, 'detail').mockResolvedValue(detail);
      const result = await controller.detail({ id: 1 });
      expect(result).toEqual(expectedResult);
    });

    it('should return an object of details with null value', async () => {
      const detail: any = {
        id: 27,
        title: 'Nike Invincible 3',
        description:
          "With maximum cushioning to support every mile, the Invincible 3 gives you our highest level of comfort underfoot to help you stay on your feet today, tomorrow and beyond. Designed to help keep you on the run, it's super supportive and bouncy, so that you can propel down your preferred path and come back for your next run feeling ready and reinvigorated.",
        userId: 1,
        status: 'active',
        version: 0,
        createdAt: '2023-05-16T02:15:48.161Z',
        updatedAt: '2023-05-16T02:15:48.088Z',
      };

      const expectedResult = {
        data: {
          post: detail,
        },
      };

      jest.spyOn(service, 'detail').mockResolvedValue(detail);
      const result = await controller.detail({ id: 1 });
      expect(result).toEqual(expectedResult);
    });
  });
});
