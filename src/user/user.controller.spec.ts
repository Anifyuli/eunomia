import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '@/model/user.model';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const request: RegisterUserRequest = {
        username: 'testuser',
        password: 'password',
        name: 'name',
      };
      const response: UserResponse = { username: 'test', name: 'test' };
      jest.spyOn(userService, 'register').mockResolvedValue(response);

      await expect(userController.register(request)).resolves.toEqual({
        data: response,
      });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const request: LoginUserRequest = {
        username: 'testuser',
        password: 'password',
      };
      const response: UserResponse = { username: 'test', name: 'test' };
      jest.spyOn(userService, 'login').mockResolvedValue(response);

      await expect(userController.login(request)).resolves.toEqual({
        data: response,
      });
    });
  });

  describe('get', () => {
    it('should get current user', async () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'password',
        name: 'test',
        token: 'token',
      };
      const response: UserResponse = { username: 'test', name: 'test' };
      jest.spyOn(userService, 'get').mockResolvedValue(response);

      await expect(userController.get(user)).resolves.toEqual({
        data: response,
      });
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'password',
        name: 'test',
        token: 'token',
      };
      const request: UpdateUserRequest = { name: 'testUpdate' };
      const response: UserResponse = { username: 'test', name: 'test' };
      jest.spyOn(userService, 'update').mockResolvedValue(response);

      await expect(userController.update(user, request)).resolves.toEqual({
        data: response,
      });
    });
  });

  describe('logout', () => {
    it('should log out a user', async () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'password',
        name: 'test',
        token: 'token',
      };
      jest.spyOn(userService, 'logout').mockResolvedValue(undefined);

      await expect(userController.logout(user)).resolves.toEqual({
        data: true,
      });
    });
  });
});
