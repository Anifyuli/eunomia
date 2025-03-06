import { RegisterUserRequest } from '@/model/user.model';
import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType<RegisterUserRequest> = z.object({
    username: z.string().min(4).max(100),
    password: z.string().min(8).max(100),
    name: z.string().min(4).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(4).max(100),
    password: z.string().min(8).max(100),
  });

  static readonly UPDATE: ZodType = z
    .object({
      name: z.string().min(4).max(100).optional(),
      password: z.string().min(8).max(100).optional(),
    })
    .refine((data) => data.name || data.password, {
      message: 'Please input new username or password to continue!',
    });
}
