/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const newPermission = await this.prisma.permission.create({
        data: {
          roleId: createPermissionDto.roleId,
          action: createPermissionDto.action,
        },
      });
      return newPermission;
    } catch (error) {
      throw new Error('Failed to create permission: ' + error.message);
    }
  }

  async findAll() {
    try {
      const permissions = await this.prisma.permission.findMany();
      return permissions;
    } catch (error) {
      throw new Error('Failed to find permissions: ' + error.message);
    }
  }

  async findOne(id: string) {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id: id },
      });
      return permission;
    } catch (error) {
      throw new Error(
        `Failed to find permission with id ${id}: ${error.message}`,
      );
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id: id },
      });
      if (!permission) {
        throw new ForbiddenException('Permission not found');
      }
      await this.prisma.permission.update({
        where: { id: id },
        data: updatePermissionDto,
      });
      return {
        success: true,
        message: 'Permission updated successfully',
      };
    } catch (error) {
      throw new Error(
        `Failed to update permission with id ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id: id },
      });
      if (!permission) {
        throw new ForbiddenException('Permission not found');
      }
      await this.prisma.permission.delete({
        where: { id: id },
      });
      return {
        success: true,
        message: 'Permission deleted successfully',
      };
    } catch (error) {
      throw new Error(
        `Failed to delete permission with id ${id}: ${error.message}`,
      );
    }
  }
}
