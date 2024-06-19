/* eslint-disable prettier/prettier */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const newRole = await this.prisma.role.create({
        data: createRoleDto,
      });
      return newRole;
    } catch (error) {
      throw new HttpException(
        'Failed to create role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const roleLists = await this.prisma.role.findMany();
      return roleLists;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: id },
      });
      return role;
    } catch (error) {
      throw new HttpException(
        `Failed to find role with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.prisma.role.findUnique({ where: { id: id } });
      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      await this.prisma.role.update({
        where: { id: id },
        data: updateRoleDto,
      });
      return {
        success: true,
        message: 'Role updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update role with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const role = await this.prisma.role.findUnique({ where: { id: id } });
      if (!role) {
        throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
      }
      await this.prisma.role.delete({
        where: { id: id },
      });
      return {
        success: true,
        message: 'Role deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete role with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
