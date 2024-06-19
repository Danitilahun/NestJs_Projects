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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RequiredPermission } from 'src/decorators/permission';
import { AtGuards } from 'src/auth/guard/at.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('permission')
@Controller('permission')
@RequiredPermission('canManagePermission')
@UseGuards(AtGuards, PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({
    status: 201,
    description: 'The permission has been successfully created',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreatePermissionDto })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    try {
      return await this.permissionService.create(createPermissionDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create permission',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Return the list of all permissions',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      return await this.permissionService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch permissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Return the permission' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    try {
      const permission = await this.permissionService.findOne(id);
      if (!permission) {
        throw new HttpException(
          `Permission with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return permission;
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: UpdatePermissionDto })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    try {
      return await this.permissionService.update(id, updatePermissionDto);
    } catch (error) {
      throw new HttpException(
        `Failed to update permission with id ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: string) {
    try {
      return await this.permissionService.remove(id);
    } catch (error) {
      throw new HttpException(
        `Failed to delete permission with id ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
