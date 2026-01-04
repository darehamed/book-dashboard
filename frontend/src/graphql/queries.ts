import { gql } from "@apollo/client";

// Query to fetch all books
export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      name
      description
    }
  }
`;

// Mutation to create a new book
export const CREATE_BOOK = gql`
  mutation CreateBook($name: String!, $description: String!) {
    createBook(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

// Mutation to update a book
export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $name: String!, $description: String!) {
    updateBook(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

// Mutation to delete a book
export const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id)
  }
`;
