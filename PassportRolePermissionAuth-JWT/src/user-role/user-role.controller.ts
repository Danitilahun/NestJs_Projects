/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RequiredPermission } from 'src/decorators/permission';
import { AtGuards } from 'src/auth/guard/at.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('User Role')
@RequiredPermission('canManageUserRole')
@UseGuards(AtGuards, PermissionGuard)
@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user role' })
  @ApiResponse({
    status: 201,
    description: 'The user role has been successfully created.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createUserRoleDto: CreateUserRoleDto) {
    try {
      return await this.userRoleService.create(createUserRoleDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create user role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all user roles' })
  @ApiResponse({ status: 200, description: 'Returns all user roles.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      return await this.userRoleService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch user roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user role by ID' })
  @ApiParam({ name: 'id', description: 'User role ID' })
  @ApiResponse({ status: 200, description: 'Returns the user role.' })
  @ApiResponse({ status: 404, description: 'User role not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.userRoleService.findOne(id);
    } catch (error) {
      throw new HttpException(
        `Failed to find user role with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user role by ID' })
  @ApiParam({ name: 'id', description: 'User role ID' })
  @ApiResponse({ status: 200, description: 'User role updated successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    try {
      return await this.userRoleService.update(id, updateUserRoleDto);
    } catch (error) {
      throw new HttpException(
        `Failed to update user role with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user role by ID' })
  @ApiParam({ name: 'id', description: 'User role ID' })
  @ApiResponse({ status: 200, description: 'User role deleted successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: string) {
    try {
      return await this.userRoleService.remove(id);
    } catch (error) {
      throw new HttpException(
        `Failed to delete user role with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
