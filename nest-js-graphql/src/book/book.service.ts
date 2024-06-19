import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddBookArgs } from "./args/addbook.args";
import { UpdateBookArgs } from "./args/updatebook.args";
import { BookEntity } from "./entity/book.entity";

@Injectable()
export class BookService {
    constructor(@InjectRepository(BookEntity) public readonly bookRepo: Repository<BookEntity>) {

    }

    async findAllBooks(): Promise<BookEntity[]> {
        let books = await this.bookRepo.find();
        return books;
    }

    async findBookById(id: number): Promise<BookEntity> {
        let books = await this.bookRepo.findOne({ where: { id } });
        return books;
    }

    async deleteBook(id: number): Promise<string> {
        let books = await this.bookRepo.delete(id);
        return 'Book has been deleted';
    }

    async addBook(addBookArgs: AddBookArgs): Promise<string>{
        let book :  BookEntity = new BookEntity();
        book.title = addBookArgs.title;
        book.price = addBookArgs.price;
        book.genres =addBookArgs.genres;
        await this.bookRepo.save(book);
        return 'Book has been Successfully added'
    }

    async updateBook(updateBookArgs: UpdateBookArgs): Promise<string>{
        let book :  BookEntity = await this.bookRepo.findOne({where: {id: updateBookArgs.id}});
        book.title = updateBookArgs.title;
        book.price = updateBookArgs.price;
        book.genres = updateBookArgs.genres;
        await this.bookRepo.save(book);
        return 'Book has been Successfully updated'
    }

}