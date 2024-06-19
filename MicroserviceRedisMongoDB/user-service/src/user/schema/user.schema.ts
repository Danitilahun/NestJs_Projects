/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../enums/enums';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({
    type: [{ courseId: { type: String }, status: { type: String } }],
  })
  enrolledCourses: { courseId: string; status: string }[];

  @Prop({ type: [String] })
  notifications: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
