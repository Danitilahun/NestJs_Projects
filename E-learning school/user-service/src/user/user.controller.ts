/* eslint-disable prettier/prettier */
import {
  Controller,
  Body,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      return await this.userService.createUser({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userService.getUserById(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @MessagePattern({ cmd: 'enroll_course' })
  async enrollUserInCourse(data: {
    userId: string;
    courseId: string;
  }): Promise<void> {
    try {
      return await this.userService.enrollUserInCourse(
        data.userId,
        data.courseId,
      );
    } catch (error) {
      throw error;
    }
  }
}
