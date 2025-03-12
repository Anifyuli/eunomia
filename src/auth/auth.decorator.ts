import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { User } from '@prisma/client';

// Expanding Express Request type for safety type (in this decorator)
interface RequestWithUser extends Request {
  user?: User;
}

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (user) {
      return user;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  },
);
