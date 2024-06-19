/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays } from 'date-fns';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async myProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
        permissions: {
          select: {
            role: {
              select: {
                action: true,
              },
            },
          },
        },
      },
    });
    delete user.password;

    return user;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  // deleted unverified users

  async deleteUnverifiedUsers() {
    try {
      const thirtyDaysAgo = addDays(new Date(), -30);

      const unverifiedUsers = await this.prisma.user.findMany({
        where: {
          emailVerified: null,
          createdAt: {
            lt: thirtyDaysAgo,
          },
        },
      });

      for (const user of unverifiedUsers) {
        await this.prisma.user.delete({
          where: {
            id: user.id,
          },
        });
        console.log(`Deleted unverified user with ID ${user.id}`);
      }

      console.log('Deletion process completed.');
    } catch (error) {
      console.error('Error occurred while deleting unverified users:', error);
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleUnverifiedUsers() {
    console.log('Unverified users schedularly deleted');
    this.deleteUnverifiedUsers();
  }
}
