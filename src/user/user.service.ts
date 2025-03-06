import { RegisterUserRequest, UserResponse } from '@/model/user.model';
import { PrismaService } from '@/prisma/prisma.service';
import { ValidationService } from '@/validation/validation.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  // Register method
  async register(req: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`New user registered - ${JSON.stringify(req)}`);

    const registerRequest =
      this.validationService.validate<RegisterUserRequest>(
        UserValidation.REGISTER,
        req,
      );

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: { username: registerRequest.username },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exist.', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...registerRequest,
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }
}
