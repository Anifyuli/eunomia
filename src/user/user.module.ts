import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ValidationService } from '@/validation/validation.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ValidationService, PrismaService],
})
export class UserModule {}
