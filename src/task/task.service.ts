import {
  CreateTaskRequest,
  SearchTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from '@/model/task.model';
import { PrismaService } from '@/prisma/prisma.service';
import { ValidationService } from '@/validation/validation.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Prisma, Task, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TaskValidation } from './task.validation';
import { WebResponse } from '@/model/web.model';

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
    const createRequest = this.validationService.validate<CreateTaskRequest>(
      TaskValidation.CREATE,
      request,
    );
    this.logger.debug(
      `TaskService create - Validation result: ${JSON.stringify(createRequest)}`,
    );

    // Find & validate user for task creation more effective
    const user = await this.prismaService.user.findUnique({
      where: { username: createRequest.username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const task = await this.prismaService.task.create({
      data: {
        username: createRequest.username,
        title: createRequest.title,
        description: createRequest.description,
        due_date: createRequest.due_date,
        status: createRequest.status,
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
    const updateRequest = this.validationService.validate<UpdateTaskRequest>(
      TaskValidation.UPDATE,
      request,
    );

    await this.taskIsExists(user.username, updateRequest.id);

    let task = await this.taskIsExists(user.username, updateRequest.id);
    task = await this.prismaService.task.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return this.toTaskResponse(task);
  }

  /*
    Remove selected tasks
  */
  async remove(user: User, taskId: number): Promise<TaskResponse> {
    await this.taskIsExists(user.username, taskId);

    const task = await this.prismaService.task.delete({
      where: {
        id: taskId,
        username: user.username,
      },
    });

    return this.toTaskResponse(task);
  }

  /*
    Search a task
  */
  async search(
    user: User,
    request: SearchTaskRequest,
  ): Promise<WebResponse<TaskResponse[]>> {
    const searchRequest = this.validationService.validate<SearchTaskRequest>(
      TaskValidation.SEARCH,
      request,
    );

    const filters: Prisma.TaskWhereInput = {
      username: user.username,
    };

    if (searchRequest.title) {
      filters.title = {
        contains: searchRequest.title,
        mode: 'insensitive',
      };
    }

    if (searchRequest.description) {
      filters.description = {
        contains: searchRequest.description,
        mode: 'insensitive',
      };
    }

    if (searchRequest.due_date) {
      filters.due_date = searchRequest.due_date;
    }

    if (typeof searchRequest.status === 'boolean') {
      filters.status = searchRequest.status;
    }

    if (searchRequest.page == undefined || searchRequest.size == undefined) {
      searchRequest.page = 0;
      searchRequest.size = 10;
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const tasks = await this.prismaService.task.findMany({
      where: filters,
      orderBy: { due_date: 'asc' },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.task.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    //return tasks;
    return {
      data: tasks.map((task) => this.toTaskResponse(task)),
      paging: {
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
        current_page: searchRequest.page,
      },
    };
  }
}
