/* eslint-disable prettier/prettier */
import { Controller, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './schema/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('new_course')
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      return await this.notificationService.createNotification(
        createNotificationDto,
      );
    } catch (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }
  }
}
