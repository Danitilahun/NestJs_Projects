/* eslint-disable prettier/prettier */
import { NotificationType } from '../schema/notification.schema';

export class CreateNotificationDto {
  readonly message: string;
  readonly userId: string;
  readonly type?: NotificationType;
}
