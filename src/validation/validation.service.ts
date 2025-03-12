import { Injectable } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(zodType: ZodType<T>, data: unknown): T {
    const result = zodType.safeParse(data);
    if (!result.success) {
      throw new ZodError(result.error.errors);
    }
    return result.data;
  }
}
