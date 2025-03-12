import { UserResponse } from '@/model/user.model';
import { WebResponse } from '@/model/web.model';
import { TestModule } from '@/test/test.module';
import { TestService } from '@/test/test.service';
import { ValidationFilter } from '@/validation/validation.filter';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { Logger } from 'winston';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ValidationFilter());
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    afterEach(async () => {
      await app.close();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(400);
      expect(responseBody.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      // Using unique user with timestamp
      const timestamp = new Date().getTime();
      const username = `test${timestamp}`;

      const response = await request(app.getHttpServer() as unknown as App)
        .post('/api/users')
        .send({
          username: username,
          password: 'testingpass',
          name: 'test',
        });

      logger.info(response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(200);
      expect(responseBody.data?.username).toBe(username);
      expect(responseBody.data?.name).toBe('test');
    });
  });
});
