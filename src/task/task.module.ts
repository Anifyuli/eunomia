import { PrismaService } from '@/prisma/prisma.service';
import { ValidationService } from '@/validation/validation.service';
import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService, ValidationService, PrismaService],
  controllers: [TaskController],
})
export class TaskModule {}
