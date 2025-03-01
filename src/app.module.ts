import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, TaskModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
