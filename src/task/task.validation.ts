import {
  CreateTaskRequest,
  SearchTaskRequest,
  UpdateTaskRequest,
} from '@/model/task.model';
import { z, ZodType } from 'zod';

export class TaskValidation {
  static readonly CREATE = z.object({
    username: z.string(),
    title: z.string().max(250),
    description: z.string().max(350),
    due_date: z.coerce.date(),
    status: z.boolean(),
  }) satisfies ZodType<CreateTaskRequest>;

  static readonly UPDATE: ZodType<UpdateTaskRequest> = z.object({
    id: z.number(),
    username: z.string(),
    title: z.string().max(250),
    description: z.string().max(350),
    due_date: z.coerce.date(),
    status: z.boolean(),
  });

  static readonly SEARCH: ZodType<SearchTaskRequest> = z.object({
    title: z.string().max(250).optional(),
    description: z.string().max(350).optional(),
    due_date: z.date().optional(),
    status: z.boolean().optional(),
  });
}
