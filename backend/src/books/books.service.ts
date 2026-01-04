import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "./book.entity";

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  // Get all books from the database
  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  // Get a single book by ID
  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  // Create a new book
  async create(name: string, description: string): Promise<Book> {
    const book = this.booksRepository.create({ name, description });
    return this.booksRepository.save(book);
  }

  // Update an existing book
  async update(id: number, name: string, description: string): Promise<Book> {
    const book = await this.findOne(id); // This will throw if not found
    book.name = name;
    book.description = description;
    return this.booksRepository.save(book);
  }

  // Delete a book
  async remove(id: number): Promise<boolean> {
    const result = await this.booksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return true;
  }
}
