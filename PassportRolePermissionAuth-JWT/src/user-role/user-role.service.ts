/* eslint-disable prettier/prettier */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    try {
      const newRole = await this.prisma.userRole.create({
        data: {
          userId: createUserRoleDto.userId,
          roleId: createUserRoleDto.roleId,
        },
      });
      return newRole;
    } catch (error) {
      throw new ForbiddenException('Failed to create user role');
    }
  }

  async findAll() {
    try {
      const userRoles = await this.prisma.userRole.findMany();
      return userRoles;
    } catch (error) {
      throw new ForbiddenException('Failed to fetch user roles');
    }
  }

  async findOne(id: string) {
    try {
      const userRole = await this.prisma.userRole.findUnique({
        where: { id: id },
      });
      return userRole;
    } catch (error) {
      throw new ForbiddenException(`Failed to find user role with id ${id}`);
    }
  }

  async update(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    try {
      const userRole = await this.prisma.userRole.findUnique({
        where: { id: id },
      });
      if (!userRole) {
        throw new ForbiddenException('User role not found');
      }
      await this.prisma.userRole.update({
        where: { id: id },
        data: {
          userId: updateUserRoleDto.userId,
          roleId: updateUserRoleDto.roleId,
        },
      });
      return {
        success: true,
        message: 'User role updated successfully',
      };
    } catch (error) {
      throw new ForbiddenException(`Failed to update user role with id ${id}`);
    }
  }

  async remove(id: string) {
    try {
      const userRole = await this.prisma.userRole.findUnique({
        where: { id: id },
      });
      if (!userRole) {
        throw new ForbiddenException('User role not found');
      }
      await this.prisma.userRole.delete({ where: { id: id } });
      return {
        success: true,
        message: 'User role deleted successfully',
      };
    } catch (error) {
      throw new ForbiddenException(`Failed to delete user role with id ${id}`);
    }
  }
}
