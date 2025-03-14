import {
  CreateTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from '@/model/task.model';
import { PrismaService } from '@/prisma/prisma.service';
import { ValidationService } from '@/validation/validation.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TaskValidation } from './task.validation';

@Injectable()
export class TaskService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  // Converting to detailed response structure
  toTaskResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      username: task.username,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      status: task.status,
    };
  }

  // Avoid duplicating task method
  async taskIsExists(username: string, taskId: number): Promise<Task> {
    const task = await this.prismaService.task.findFirst({
      where: {
        id: taskId,
        username: username,
      },
    });

    if (task) {
      this.logger.debug(
        `TaskService taskIsExists - Task found: ${JSON.stringify(task)}`,
      );
    } else {
      this.logger.warn(
        `TaskService taskIsExists - Task not found for user ${username} and taskId ${taskId}`,
      );
    }

    if (!task) {
      throw new HttpException('Task not found', 404);
    }

    return task;
  }

  /*
   Create task method 
  */
  async create(request: CreateTaskRequest): Promise<TaskResponse> {
    this.logger.debug(`TaskService create - (${JSON.stringify(request)})`);

    // Response conversion
    const createTaskRequest =
      this.validationService.validate<CreateTaskRequest>(
        TaskValidation.CREATE,
        request,
      );
    this.logger.debug(
      `TaskService create - Validation result: ${JSON.stringify(createTaskRequest)}`,
    );

    // Find & validate user for task creation more effective
    const user = await this.prismaService.user.findUnique({
      where: { username: createTaskRequest.username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const task = await this.prismaService.task.create({
      data: {
        username: createTaskRequest.username,
        title: createTaskRequest.title,
        description: createTaskRequest.description,
        due_date: createTaskRequest.due_date,
        status: createTaskRequest.status,
      },
    });

    return this.toTaskResponse(task);
  }

  /*
    Get task method
  */
  async get(user: User, taskId: number): Promise<TaskResponse> {
    const task = await this.taskIsExists(user.username, taskId);

    return this.toTaskResponse(task);
  }

  /*
    Update task method
  */
  async update(user: User, request: UpdateTaskRequest): Promise<TaskResponse> {
    const updateTaskRequest =
      this.validationService.validate<UpdateTaskRequest>(
        TaskValidation.UPDATE,
        request,
      );

    await this.taskIsExists(user.username, updateTaskRequest.id);

    let task = await this.taskIsExists(user.username, updateTaskRequest.id);
    task = await this.prismaService.task.update({
      where: {
        id: updateTaskRequest.id,
      },
      data: updateTaskRequest,
    });

    return this.toTaskResponse(task);
  }
}
