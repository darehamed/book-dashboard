import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { CREATE_BOOK, UPDATE_BOOK, GET_BOOKS } from "../graphql/queries";

interface Book {
  id: number;
  name: string;
  description: string;
}

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onSuccess: () => void;
}

function BookForm({ isOpen, onClose, book, onSuccess }: BookFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();

  // Determine if we're editing or creating based on whether book prop exists
  const isEditing = book !== null;

  // Setup mutations for creating and updating
  const [createBook, { loading: creating }] = useMutation(CREATE_BOOK);
  const [updateBook, { loading: updating }] = useMutation(UPDATE_BOOK);

  // Populate form fields when editing an existing book
  useEffect(() => {
    if (book) {
      setName(book.name);
      setDescription(book.description);
    } else {
      // Clear form when creating new book
      setName("");
      setDescription("");
    }
  }, [book]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing book
        await updateBook({
          variables: {
            id: book.id,
            name,
            description,
          },
          refetchQueries: [{ query: GET_BOOKS }],
        });
      } else {
        // Create new book
        await createBook({
          variables: {
            name,
            description,
          },
          refetchQueries: [{ query: GET_BOOKS }],
        });
      }

      onSuccess();
    } catch (err) {
      toast({
        title: "Error saving book",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "Edit Book" : "Create Book"}</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter book name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter book description"
                rows={4}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={creating || updating}
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default BookForm;
