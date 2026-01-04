import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./book.entity";
import { BooksService } from "./books.service";
import { BooksResolver } from "./books.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]), // Make Book entity available to this module
    AuthModule, // Import auth module for the guard
  ],
  providers: [BooksService, BooksResolver],
})
export class BooksModule {}
