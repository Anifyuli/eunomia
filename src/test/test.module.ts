import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TestService } from './test.service';

@Module({
  providers: [TestService, PrismaService],
  exports: [TestService],
})
export class TestModule {}
