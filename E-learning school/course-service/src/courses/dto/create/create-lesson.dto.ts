/* eslint-disable prettier/prettier */

import { CreateLectureDto } from './create-lecture.dto';

// create-lesson.dto.ts
export class CreateLessonDto {
  readonly title: string;
  readonly content: string;
  readonly type: string;
  readonly duration: string;
  readonly numberOfLectures: number;
  readonly lectures: CreateLectureDto[];
}
