import { PrismaService } from '../prisma/prisma.service';
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
    // Using deleteMany for avoid errors if test user not found
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  // Get test user
  async getUser(): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
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
