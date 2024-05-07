/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create/create-course.dto';
import { firstValueFrom } from 'rxjs';
import { UpdateCourseDto } from './dto/update/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private readonly courseModel: Model<Course>,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationServiceClient: ClientProxy,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const userObservable = this.userServiceClient.send<any>(
        { cmd: 'get_user_by_id' },
        createCourseDto.instructorId,
      );

      // Convert Observable to Promise
      const user = await firstValueFrom(userObservable);

      if (user && user['role'] !== 'instructor') {
        throw new ForbiddenException('Only instructors can create courses');
      }

      const createdCourse = new this.courseModel(createCourseDto);
      const savedCourse = await createdCourse.save();

      const notificationMessage = `Course named "${createCourseDto.title}" created successfully`;

      this.notificationServiceClient.emit('new_course', {
        message: notificationMessage,
        type: 'info',
        userId: createCourseDto.instructorId,
      });

      return savedCourse;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async getCoursesByInstructorId(instructorId: string): Promise<Course[]> {
    try {
      console.log('in service', instructorId);
      const courses = await this.courseModel.find({ instructorId }).exec();
      if (!courses) {
        throw new NotFoundException('No courses found for this instructor');
      }
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(
    courseId: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    try {
      console.log('IN service', courseId, updateCourseDto);

      const updatedCourse = await this.courseModel
        .findByIdAndUpdate(courseId, updateCourseDto, {
          new: true, // Return the updated document
          runValidators: true, // Run validators defined in the schema
        })
        .exec();

      if (!updatedCourse) {
        throw new NotFoundException('Course not found');
      }

      return updatedCourse;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(courseId: string): Promise<string> {
    try {
      console.log('in service', courseId);
      const deletedCourse = await this.courseModel
        .findByIdAndDelete(courseId)
        .exec();

      console.log('After deleted', deletedCourse);
      if (!deletedCourse) {
        throw new NotFoundException('Course not found');
      }
      return 'Course deleted successfully';
    } catch (error) {
      throw error;
    }
  }

  async enrollUserInCourse(userId: string, courseId: string): Promise<void> {
    try {
      // Check if the course exists

      console.log(userId, courseId);
      const course = await this.courseModel.findById(courseId).exec();
      if (!course) {
        throw new NotFoundException('Course not found');
      }

      const user_enrolled_courses = this.userServiceClient.send<any>(
        { cmd: 'enroll_course' },
        { userId, courseId },
      );

      // Convert Observable to Promise
      const user_enrolled_course_course = await firstValueFrom(
        user_enrolled_courses,
      );

      console.log(user_enrolled_course_course);

      const notificationMessage = `Course "${course.title}" successfully registered`;

      this.notificationServiceClient.emit('new_course', {
        message: notificationMessage,
        type: 'info',
        userId: userId,
      });

      // Increment numberOfUsersEnrolled
      course.numberOfUsersEnrolled++;
      // Save the updated course
      await course.save();

      return user_enrolled_course_course;
    } catch (error) {
      throw error;
    }
  }

  async getEnrolledCourses(userId: string): Promise<Course[]> {
    try {
      console.log('userId in service', userId);
      const userObservable = this.userServiceClient.send<any>(
        { cmd: 'get_user_by_id' },
        userId,
      );

      // Convert Observable to Promise
      const user = await firstValueFrom(userObservable);

      console.log(user);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Fetch the enrolled courses from the database using the IDs stored in the user's enrolledCourses array
      const enrolledCourseIds = user.enrolledCourses.map(
        (course) => course.courseId,
      );
      const enrolledCourses = await this.courseModel
        .find({
          _id: { $in: enrolledCourseIds },
        })
        .exec();

      return enrolledCourses;
    } catch (error) {
      throw error;
    }
  }
}
