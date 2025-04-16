import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from '@/auth/auth.decorator';
import { User } from '@prisma/client';
import {
  CreateTaskRequest,
  SearchTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from '@/model/task.model';
import { WebResponse } from '@/model/web.model';

@Controller('/api/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // Task creation POST /api/tasks
  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateTaskRequest,
  ): Promise<WebResponse<TaskResponse>> {
    const result = await this.taskService.create(request);

    return {
      data: result,
    };
  }

  // Get a task info GET /api/tasks/:taskId
  @Get('/:taskId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<WebResponse<TaskResponse>> {
    const result = await this.taskService.get(user, taskId);

    return {
      data: result,
    };
  }

  // Update edited tasks PUT /api/tasks/:taskId
  @Put('/:taskId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: UpdateTaskRequest,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<WebResponse<TaskResponse>> {
    request.id = taskId;
    const result = await this.taskService.update(user, request);

    return {
      data: result,
    };
  }

  // Search tasks GET /api/tasks
  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('title') title?: string,
    @Query('description') description?: string,
    @Query('due_date') due_date?: string,
    @Query('status') status?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<TaskResponse[]>> {
    const request: SearchTaskRequest = {
      title,
      description,
      due_date: due_date ? new Date(due_date) : undefined,
      status: status !== undefined ? status === 'true' : undefined,
      page: page || 1,
      size: size || 10,
    };

    return this.taskService.search(user, request);
  }

  // Delete task DELETE /api/tasks/:taskId
  @Delete('/:taskId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<WebResponse<boolean>> {
    await this.taskService.remove(user, taskId);

    return {
      data: true,
    };
  }
}
