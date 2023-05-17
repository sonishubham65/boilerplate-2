import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PostModule } from '../src/modules/post/post.module';
import { PostService } from '../src/modules/post/post.service';
import { PostController } from 'src/modules/post/post.controller';

describe('Cats', () => {
  let app: INestApplication;
  let postService = {
    findOne: jest.fn((id) => {
      return {
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
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PostModule],
    })
      .overrideProvider(PostService)
      .useValue(postService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe(`/GET post/details`, () => {
    it(`with token`, async () => {
      const postId = 1;
      const expectedResponse = {
        data: postService.findOne(postId),
      };

      const response = await request(app.getHttpServer())
        .get(`/v1/post/detail/${postId}`)
        .set(
          'Authorization',
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzb25pc2h1YmhhbTY1QGdtYWlsLmNvbSIsIm5hbWUiOiJTaHViaGFtIFNvbmkiLCJwYXNzd29yZCI6bnVsbCwic3RhdHVzIjoiaW5hY3RpdmUiLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNjg0MTQzNTk3LCJleHAiOjE2ODcxNDM1OTd9.r8lXoTnm_f1JrNvd9pyk47Q70AE_maX98iuwYhr1ulM`,
        )
        .expect(200);
      expect(response.body).toEqual(expectedResponse);
      expect(postService.findOne).toHaveBeenCalledWith(postId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
