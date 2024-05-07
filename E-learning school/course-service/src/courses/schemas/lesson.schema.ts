/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Lecture, LectureSchema } from './lecture.schema';

export type LessonDocument = Lesson & Document;

@Schema()
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  type: string; // e.g., video, text, image

  @Prop()
  duration: string; // duration of the lesson (optional)

  @Prop({ type: [LectureSchema], default: [] })
  lectures: Lecture[]; // Collection of lectures within the lesson

  @Prop({ required: true })
  numberOfLectures: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
