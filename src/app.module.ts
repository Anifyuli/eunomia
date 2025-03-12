import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthMiddleware } from './auth/auth.middleware';
import { PrismaService } from './prisma/prisma.service';
import { TaskModule } from './task/task.module';
import { TestModule } from './test/test.module';
import { TestService } from './test/test.service';
import { UserModule } from './user/user.module';
import { ValidationService } from './validation/validation.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TaskModule,
    UserModule,
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
      level: 'debug',
    }),
    TestModule,
  ],
  controllers: [],
  providers: [PrismaService, TestService, ValidationService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}
