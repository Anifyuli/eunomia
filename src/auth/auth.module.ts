import { Module } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';

@Module({
  exports: [AuthMiddleware],
})
export class AuthModule {}
