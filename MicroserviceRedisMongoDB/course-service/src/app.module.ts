/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/e_learning_school'),
    CoursesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
