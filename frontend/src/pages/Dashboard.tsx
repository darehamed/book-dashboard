import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Heading,
  HStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import BookTable from "../components/BookTable";
import BookForm from "../components/BookForm";

function Dashboard() {
  const { logout } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingBook, setEditingBook] = useState(null);
  const toast = useToast();

  // Open form for creating new book
  const handleCreate = () => {
    setEditingBook(null);
    onOpen();
  };

  // Open form for editing existing book
  const handleEdit = (book: any) => {
    setEditingBook(book);
    onOpen();
  };

  // Close form and reset editing state
  const handleCloseForm = () => {
    setEditingBook(null);
    onClose();
  };

  // Show success message after save
  const handleSaveSuccess = () => {
    toast({
      title: editingBook ? "Book updated" : "Book created",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    handleCloseForm();
  };

  return (
    <Box>
      <HStack justify="space-between" mb={8}>
        <Heading size="xl">Book Dashboard</Heading>
        <HStack>
          <Button colorScheme="blue" onClick={handleCreate}>
            Add Book
          </Button>
          <Button variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </HStack>
      </HStack>

      <BookTable onEdit={handleEdit} />

      <BookForm
        isOpen={isOpen}
        onClose={handleCloseForm}
        book={editingBook}
        onSuccess={handleSaveSuccess}
      />
    </Box>
  );
}

export default Dashboard;
