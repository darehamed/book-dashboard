import { useQuery, useMutation } from "@apollo/client";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { GET_BOOKS, DELETE_BOOK } from "../graphql/queries";
import DeleteConfirmation from "./DeleteConfirmation";
import { useState } from "react";

interface Book {
  id: number;
  name: string;
  description: string;
}

interface BookTableProps {
  onEdit: (book: Book) => void;
}

function BookTable({ onEdit }: BookTableProps) {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const toast = useToast();

  // Open delete confirmation dialog
  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    onOpen();
  };

  // Actually delete the book after confirmation
  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      await deleteBook({
        variables: { id: bookToDelete.id },
        // Update cache to remove the deleted book from the list
        refetchQueries: [{ query: GET_BOOKS }],
      });

      toast({
        title: "Book deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error deleting book",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
    setBookToDelete(null);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return <Spinner size="xl" />;
  }

  // Show error message if query failed
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading books: {error.message}
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.books.map((book: Book) => (
                <Tr key={book.id}>
                  <Td>{book.id}</Td>
                  <Td>{book.name}</Td>
                  <Td>{book.description}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit book"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => onEdit(book)}
                      />
                      <IconButton
                        aria-label="Delete book"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteClick(book)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <DeleteConfirmation
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleConfirmDelete}
        bookName={bookToDelete?.name || ""}
      />
    </>
  );
}

export default BookTable;
