import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable CORS so our frontend can communicate with the backend
  // In production, you'd want to restrict this to specific origins
  app.enableCors({
    origin: "*", // Allow all origins for development
    credentials: true,
  });

  // Start the server on port 4000 (or whatever is in .env)
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/graphql`);
}

bootstrap();
