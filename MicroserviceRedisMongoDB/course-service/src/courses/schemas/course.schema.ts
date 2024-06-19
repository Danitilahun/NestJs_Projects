/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Lesson, LessonSchema } from './lesson.schema';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  instructorId: string;

  @Prop({ type: [LessonSchema], default: [] })
  lessons: Lesson[];

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  numberOfUsersEnrolled: number;

  @Prop({ default: 0 })
  numberOfRatings: number;

  @Prop()
  language: string;

  @Prop()
  duration: string;

  @Prop({ default: false })
  hasCertification: boolean;

  @Prop()
  numberOfLessons: number;

  @Prop()
  requirements: string;

  @Prop()
  targetAudience: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
