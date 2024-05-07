/* eslint-disable prettier/prettier */
import { Body, Controller } from '@nestjs/common';
import { CreateCourseDto } from './dto/create/create-course.dto';
import { Course } from './schemas/course.schema';
import { CourseService } from './courses.service';
import { MessagePattern } from '@nestjs/microservices';
import { UpdateCourseDto } from './dto/update/update-course.dto';

@Controller()
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @MessagePattern({ cmd: 'create_course' })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    try {
      return await this.courseService.createCourse(createCourseDto);
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  @MessagePattern({ cmd: 'get_courses_by_instructor_id' })
  async getCoursesByInstructorId(
    @Body('instructorId') instructorId: string,
  ): Promise<Course[]> {
    try {
      return await this.courseService.getCoursesByInstructorId(instructorId);
    } catch (error) {
      throw new Error(
        `Error getting courses by instructor ID: ${error.message}`,
      );
    }
  }

  @MessagePattern({ cmd: 'update_course' })
  async updateCourse(
    @Body('courseId') courseId: string,
    @Body('updateCourseDto') updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    try {
      return await this.courseService.updateCourse(courseId, updateCourseDto);
    } catch (error) {
      throw new Error(`Error updating course: ${error.message}`);
    }
  }

  @MessagePattern({ cmd: 'delete_course' })
  async deleteCourse(@Body('courseId') courseId: string): Promise<any> {
    try {
      return await this.courseService.deleteCourse(courseId);
    } catch (error) {
      throw new Error(`Error deleting course: ${error.message}`);
    }
  }

  @MessagePattern({ cmd: 'enroll_user_in_course' })
  async enrollUserInCourse(
    @Body('userId') userId: string,
    @Body('courseId') courseId: string,
  ): Promise<void> {
    try {
      return await this.courseService.enrollUserInCourse(userId, courseId);
    } catch (error) {
      throw new Error(`Error enrolling user in course: ${error.message}`);
    }
  }

  @MessagePattern({ cmd: 'get_enrolled_courses' })
  async getEnrolledCourses(@Body('userId') userId: string): Promise<Course[]> {
    try {
      return await this.courseService.getEnrolledCourses(userId);
    } catch (error) {
      throw new Error(`Error getting enrolled courses: ${error.message}`);
    }
  }
}
