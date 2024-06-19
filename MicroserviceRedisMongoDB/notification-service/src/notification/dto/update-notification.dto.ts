/* eslint-disable prettier/prettier */
import { NotificationType } from '../schema/notification.schema';

// update-notification.dto.ts
export class UpdateNotificationDto {
  readonly message?: string;
  readonly type?: NotificationType;
  readonly seen?: boolean;
}
