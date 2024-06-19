/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/e_learning_school'),
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
