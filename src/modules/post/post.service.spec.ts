import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'sequelize-typescript';
import { POST_REPOSITORY } from '../database/database.constant';
import PostModel from './post.model';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let postModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: POST_REPOSITORY,
          useValue: PostModel,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postModel = module.get<Repository<typeof POST_REPOSITORY>>(POST_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Detail function', () => {
    it('should return an object of detail', async () => {
      const detail: any = {
        id: 1,
        title: 'Nike Invincible 3',
        description:
          "With maximum cushioning to support every mile, the Invincible 3 gives you our highest level of comfort underfoot to help you stay on your feet today, tomorrow and beyond. Designed to help keep you on the run, it's super supportive and bouncy, so that you can propel down your preferred path and come back for your next run feeling ready and reinvigorated.",
        userId: 1,
        status: 'active',
        version: 0,
        createdAt: '2023-05-16T02:15:48.161Z',
        updatedAt: '2023-05-16T02:15:48.088Z',
      };

      const expectedResult = detail;
      jest.spyOn(postModel, 'findOne').mockResolvedValue(detail);
      const result = await service.detail(1);
      expect(result).toEqual(expectedResult);
    });

    it('should return a null value', async () => {
      const detail: any = null;

      const expectedResult = detail;
      jest.spyOn(postModel, 'findOne').mockResolvedValue(detail);
      const result = await service.detail(0);
      console.log(`result`, result);
      expect(result).toEqual(null);
    });

  });
});
