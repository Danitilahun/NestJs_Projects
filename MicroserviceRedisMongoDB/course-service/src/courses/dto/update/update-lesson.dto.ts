/* eslint-disable prettier/prettier */

import { UpdateLectureDto } from './update-lecture.dto';

// update-lesson.dto.ts
export class UpdateLessonDto {
  readonly title?: string;
  readonly content?: string;
  readonly type?: string;
  readonly duration?: string;
  readonly numberOfLectures?: number;
  readonly lectures?: UpdateLectureDto[];
}
