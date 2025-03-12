import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

// Expanding Express Request type
interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader;

      if (token) {
        const user = await this.prismaService.user.findFirst({
          where: {
            token: token,
          },
        });

        if (user) {
          req.user = user;
        }
      }
    }

    next();
  }
}
