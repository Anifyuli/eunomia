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

      logger.info('Response for invalid registration:', response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(400);
      expect(responseBody.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const timestamp = new Date().getTime();
      const username = `test${timestamp}`;

      const response = await request(app.getHttpServer() as unknown as App)
        .post('/api/users')
        .send({
          username: username,
          password: 'testingpass',
          name: 'test',
        });

      logger.info('Response for successful registration:', response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(200);
      expect(responseBody.data?.username).toBe(username);
      expect(responseBody.data?.name).toBe('test');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
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
        });

      logger.info('Response for invalid login:', response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(400);
      expect(responseBody.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      const timestamp = new Date().getTime();
      const username = `test${timestamp}`;

      const response = await request(app.getHttpServer() as unknown as App)
        .post('/api/users')
        .send({
          username: username,
          password: 'testingpass',
          name: 'test',
        });

      logger.info('Response for successful login:', response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(200);
      expect(responseBody.data?.username).toBe(username);
      expect(responseBody.data?.name).toBe('test');
      expect(responseBody.data?.token).toBeDefined();
    });
  });

  describe('GET /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .get('/api/users/current')
        .set('Authorization', 'wrong');

      logger.info('Response for invalid token:', response.body);

      expect(response.status).toBe(401);
    });

    it('should be able to get user', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .get('/api/users/current')
        .set('Authorization', 'test');

      logger.info('Response for getting current user:', response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(200);
      expect(responseBody.data?.username).toBe('test');
      expect(responseBody.data?.name).toBe('test');
    });
  });

  describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
          password: '',
          name: '',
        });

      logger.info('Response for invalid update request:', response.body);

      expect(response.status).toBe(400);
    });

    it('should be able to update name', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
          name: 'test updated',
        });

      logger.info('Response for updating name:', response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(200);
      expect(responseBody.data?.username).toBe('test');
      expect(responseBody.data?.name).toBe('test updated');
    });

    it('should be able to update password', async () => {
      let response = await request(app.getHttpServer() as unknown as App)
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
          password: 'updatedpass',
        });

      logger.debug('Response for updating password:', response.body);
      expect(response.status).toBe(200);

      response = await request(app.getHttpServer() as unknown as App)
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'testpass',
        });
      expect(response.status).toBe(401);

      response = await request(app.getHttpServer() as unknown as App)
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'updatedpass',
        });
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .delete('/api/users/current')
        .set('Authorization', 'wrong');

      logger.info('Response for invalid token during logout:', response.body);

      expect(response.status).toBe(401);
    });

    it('should be able to logout', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .delete('/api/users/current')
        .set('Authorization', 'test');

      logger.info('Response for successful logout:', response.body);
      const responseBody = response.body as WebResponse<UserResponse>;

      expect(response.status).toBe(200);
      expect(responseBody.data).toBe(true);

      const user = await testService.getUser();
      expect(user?.token).toBe('');
    });
  });
});
