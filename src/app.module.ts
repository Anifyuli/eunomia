import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { WinstonModule } from 'nest-winston';
import { ValidationService } from './validation/validation.service';
import winston from 'winston';

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
  ],
  controllers: [],
  providers: [PrismaService, ValidationService],
})
export class AppModule {}
