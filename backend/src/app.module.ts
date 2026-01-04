import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BooksModule } from "./books/books.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    // Setup GraphQL with Apollo
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Automatically generate schema from resolvers
      playground: true, // Enable GraphQL playground for testing
      context: ({ req }) => ({ req }), // Pass request to context for auth
    }),

    // Setup TypeORM with SQLite database
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite", // Store database in a file
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true, // Auto-create tables (don't use in production!)
    }),

    // Import our custom modules
    AuthModule,
    BooksModule,
  ],
})
export class AppModule {}
