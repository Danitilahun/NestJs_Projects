/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserPermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createUserPermissionDto: CreateUserPermissionDto) {
    try {
      const newUserPermission = await this.prisma.userPermission.create({
        data: {
          userId: createUserPermissionDto.userId,
          permissionId: createUserPermissionDto.permissionId,
        },
      });
      return newUserPermission;
    } catch (error) {
      throw new ForbiddenException('Failed to create user permission');
    }
  }

  async findAll() {
    try {
      const userPermissions = await this.prisma.userPermission.findMany();
      return userPermissions;
    } catch (error) {
      throw new ForbiddenException('Failed to fetch user permissions');
    }
  }

  async findOne(id: string) {
    try {
      const userPermission = await this.prisma.userPermission.findUnique({
        where: { id: id },
      });
      return userPermission;
    } catch (error) {
      throw new ForbiddenException(
        `Failed to find user permission with id ${id}`,
      );
    }
  }

  async update(id: string, updateUserPermissionDto: UpdateUserPermissionDto) {
    try {
      const userPermission = await this.prisma.userPermission.findUnique({
        where: { id: id },
      });
      if (!userPermission) {
        throw new ForbiddenException('User permission not found');
      }
      await this.prisma.userPermission.update({
        where: { id: id },
        data: {
          userId: updateUserPermissionDto.userId,
          permissionId: updateUserPermissionDto.permissionId,
        },
      });
      return {
        success: true,
        message: 'Permission updated successfully',
      };
    } catch (error) {
      throw new ForbiddenException(
        `Failed to update user permission with id ${id}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const userPermission = await this.prisma.userPermission.findUnique({
        where: { id: id },
      });
      if (!userPermission) {
        throw new ForbiddenException('User permission not found');
      }
      await this.prisma.userPermission.delete({ where: { id: id } });
      return {
        success: true,
        message: 'Permission deleted successfully',
      };
    } catch (error) {
      throw new ForbiddenException(
        `Failed to delete user permission with id ${id}`,
      );
    }
  }
}
