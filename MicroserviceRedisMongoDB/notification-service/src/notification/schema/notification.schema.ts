/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type: NotificationType;

  @Prop({ default: false })
  seen: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true }) // Assuming userId is required
  userId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
