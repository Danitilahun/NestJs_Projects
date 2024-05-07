/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('COURSE_SERVICE') private readonly courseClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('/users')
  async UserCourse(@Body() createCourseDto: any): Promise<Observable<any>> {
    try {
      return this.userClient.send<any>({ cmd: 'create_user' }, createCourseDto);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  @Post('/courses')
  async CreateCourse(@Body() createCourseDto: any): Promise<Observable<any>> {
    try {
      return this.courseClient.send<any>(
        { cmd: 'create_course' },
        createCourseDto,
      );
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  @Put('/courses/:courseId')
  async UpdateCourse(
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: any,
  ): Promise<Observable<any>> {
    try {
      return this.courseClient.send<any>(
        { cmd: 'update_course' },
        { courseId, updateCourseDto },
      );
    } catch (error) {
      throw new Error(`Error updating course: ${error.message}`);
    }
  }

  @Get('/courses/:instructorId')
  async GetCoursesByInstructorId(
    @Param('instructorId') instructorId: string,
  ): Promise<Observable<any>> {
    try {
      return this.courseClient.send<any>(
        { cmd: 'get_courses_by_instructor_id' },
        { instructorId },
      );
    } catch (error) {
      throw new Error(
        `Error getting courses by instructor ID: ${error.message}`,
      );
    }
  }

  @Delete('/courses/:courseId')
  async DeleteCourse(
    @Param('courseId') courseId: string,
  ): Promise<Observable<any>> {
    try {
      return this.courseClient.send<any>(
        { cmd: 'delete_course' },
        { courseId },
      );
    } catch (error) {
      throw new Error(`Error deleting course: ${error.message}`);
    }
  }

  @Put('/courses/:courseId/:userId')
  async EnrollUserInCourse(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ): Promise<Observable<any>> {
    try {
      return this.courseClient.send<any>(
        { cmd: 'enroll_user_in_course' },
        { userId, courseId },
      );
    } catch (error) {
      throw new Error(`Error enrolling user in course: ${error.message}`);
    }
  }

  @Get('/courses/user/:userId')
  async GetEnrolledCourses(
    @Param('userId') userId: string,
  ): Promise<Observable<any>> {
    try {
      return this.courseClient.send<any>(
        { cmd: 'get_enrolled_courses' },
        { userId },
      );
    } catch (error) {
      throw new Error(`Error getting enrolled courses: ${error.message}`);
    }
  }
}
