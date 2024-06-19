import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';
import { BookEntity } from './entity/book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BookEntity])],
    controllers: [],
    providers: [BookResolver,BookService],
})
export class BookModule{}