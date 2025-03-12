import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  // Delete all test data
  async deleteAll() {
    await this.deleteUser();
  }

  // Delete test user
  async deleteUser() {
    await this.prismaService.user.delete({
      where: {
        username: 'test',
      },
    });
  }

  // Get test user
  async getUser(): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Create test user
  async createUser() {
    const existingUser = await this.getUser();

    if (!existingUser) {
      await this.prismaService.user.create({
        data: {
          username: 'test',
          name: 'test',
          password: await bcrypt.hash('test', 10),
          token: 'test',
        },
      });
    }
  }
}
