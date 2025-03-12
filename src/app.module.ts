import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { WinstonModule } from 'nest-winston';
import { ValidationService } from './validation/validation.service';
import { TestService } from './test/test.service';
import { TestModule } from './test/test.module';
import winston from 'winston';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    AuthModule,
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
  providers: [PrismaService, ValidationService, TestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}
