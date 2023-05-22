import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PostModule } from '../src/modules/post/post.module';
import { PostService } from '../src/modules/post/post.service';

const ACCESSTOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzb25pc2h1YmhhbTY1QGdtYWlsLmNvbSIsIm5hbWUiOiJTaHViaGFtIFNvbmkiLCJwYXNzd29yZCI6bnVsbCwic3RhdHVzIjoiaW5hY3RpdmUiLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNjg0MTQzNTk3LCJleHAiOjE2ODcxNDM1OTd9.r8lXoTnm_f1JrNvd9pyk47Q70AE_maX98iuwYhr1ulM`;
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
        .set('Authorization', `Bearer ${ACCESSTOKEN}`)
        .expect(200);
      expect(response.body).toEqual(expectedResponse);
      expect(postService.findOne).toHaveBeenCalledWith(postId);
    });

    it(`without token`, async () => {
      const postId = 1;
      const expectedResponse = {
        message: 'Unauthorized',
        data: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      };

      const response = await request(app.getHttpServer())
        .get(
          `/v1/post/list?limit=2&page=1&order[0][]=id&order[0][]=desc&order[1][]=title&order[1][]=ASC`,
        )
        .expect(401);
      expect(response.body).toEqual(expectedResponse);
      expect(postService.findOne).toHaveBeenCalledWith(postId);
    });

    it(`validation`, async () => {
      const postId = 1;
      const expectedResponse = {
        message: 'Unprocessable Entity Exception',
        data: {
          statusCode: 422,
          message: [
            'id must be a number conforming to the specified constraints',
            'id must not be less than 1',
          ],
          error: 'Unprocessable Entity',
        },
      };

      const response = await request(app.getHttpServer())
        .get(`/v1/post/detail/_`)
        .set('Authorization', `Bearer ${ACCESSTOKEN}`)
        .expect(422);
      expect(response.body).toEqual(expectedResponse);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
