import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { BooksService } from "./books.service";
import { Book } from "./book.entity";
import { AuthGuard } from "../auth/auth.guard";

@Resolver(() => Book)
// Protect all endpoints in this resolver with authentication
@UseGuards(AuthGuard)
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  // Query to get all books
  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  // Query to get a single book by ID
  @Query(() => Book)
  async book(@Args("id", { type: () => Int }) id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }

  // Mutation to create a new book
  @Mutation(() => Book)
  async createBook(
    @Args("name") name: string,
    @Args("description") description: string,
  ): Promise<Book> {
    return this.booksService.create(name, description);
  }

  // Mutation to update an existing book
  @Mutation(() => Book)
  async updateBook(
    @Args("id", { type: () => Int }) id: number,
    @Args("name") name: string,
    @Args("description") description: string,
  ): Promise<Book> {
    return this.booksService.update(id, name, description);
  }

  // Mutation to delete a book
  @Mutation(() => Boolean)
  async deleteBook(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.booksService.remove(id);
  }
}
