/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { GetUser } from 'src/decorators';
import { RequiredPermission } from 'src/decorators/permission';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { AtGuards } from 'src/auth/guard/at.guard';

@RequiredPermission('canManageUser')
@UseGuards(AtGuards, PermissionGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AtGuards)
  @Get()
  myProfile(@GetUser() userId: any) {
    return this.userService.myProfile(userId['id']);
  }

  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
