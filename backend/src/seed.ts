import { DataSource } from "typeorm";
import { Book } from "./books/book.entity";

// Sample books to seed the database
const sampleBooks = [
  {
    name: "To Kill a Mockingbird",
    description:
      "A classic novel by Harper Lee about racial injustice in the American South during the 1930s.",
  },
  {
    name: "1984",
    description:
      "George Orwell's dystopian novel about totalitarianism and surveillance.",
  },
  {
    name: "The Great Gatsby",
    description:
      "F. Scott Fitzgerald's story of the American Dream in the Jazz Age.",
  },
  {
    name: "Pride and Prejudice",
    description:
      "Jane Austen's romantic novel about Elizabeth Bennet and Mr. Darcy.",
  },
  {
    name: "The Catcher in the Rye",
    description:
      "J.D. Salinger's novel about teenage rebellion and alienation.",
  },
  {
    name: "Harry Potter and the Sorcerer's Stone",
    description:
      "J.K. Rowling's first book in the beloved Harry Potter series about a young wizard.",
  },
  {
    name: "The Hobbit",
    description:
      "J.R.R. Tolkien's fantasy adventure about Bilbo Baggins and his quest.",
  },
  {
    name: "The Lord of the Rings",
    description:
      "Epic fantasy trilogy by J.R.R. Tolkien about the quest to destroy the One Ring.",
  },
];

async function seed() {
  // Create connection to the SQLite database
  const dataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    entities: [Book],
    synchronize: false, // Don't auto-sync, we'll handle it manually
  });

  try {
    // Initialize the connection
    await dataSource.initialize();
    console.log("Connected to database");

    // Get the Book repository
    const bookRepository = dataSource.getRepository(Book);

    // Check if books already exist
    const existingBooks = await bookRepository.count();

    if (existingBooks > 0) {
      console.log(
        `Database already has ${existingBooks} books. Skipping seed.`,
      );
      await dataSource.destroy();
      return;
    }

    // Insert sample books
    console.log("Seeding database with sample books...");

    for (const bookData of sampleBooks) {
      const book = bookRepository.create(bookData);
      await bookRepository.save(book);
      console.log(`✓ Added: ${bookData.name}`);
    }

    console.log(`\nSuccessfully seeded ${sampleBooks.length} books!`);

    // Close the connection
    await dataSource.destroy();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seed();
