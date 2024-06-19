/* eslint-disable prettier/prettier */
import { CreateLessonDto } from './create-lesson.dto';

// create-course.dto.ts
export class CreateCourseDto {
  readonly title: string;
  readonly description: string;
  readonly instructorId: string;
  readonly price: number;
  readonly language: string;
  readonly duration: string;
  readonly hasCertification: boolean;
  readonly requirements: string;
  readonly targetAudience: string;
  readonly lessons: CreateLessonDto[];
}
