/* eslint-disable prettier/prettier */

import { UpdateLessonDto } from './update-lesson.dto';

// update-course.dto.ts
export class UpdateCourseDto {
  readonly title?: string;
  readonly description?: string;
  readonly price?: number;
  readonly language?: string;
  readonly numberOfUsersEnrolled?: number;
  readonly instructorId?: string;
  readonly duration?: string;
  readonly hasCertification?: boolean;
  readonly requirements?: string;
  readonly targetAudience?: string;
  readonly lessons: UpdateLessonDto[];
}
