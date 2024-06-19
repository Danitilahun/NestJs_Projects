/* eslint-disable prettier/prettier */

import { CourseStatus, UserRole } from '../enums/enums';

export class UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;
  readonly role?: UserRole;
  readonly enrolledCourses?: { courseId: string; status: CourseStatus }[];
  readonly notifications?: string[];
}
