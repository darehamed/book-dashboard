import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
} from "@chakra-ui/react";

function Login() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container maxW="container.sm" centerContent>
      <Box mt={20}>
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="lg" textAlign="center">
                Book Dashboard
              </Heading>
              <Text textAlign="center" color="gray.600">
                Sign in to manage your book collection
              </Text>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => loginWithRedirect()}
              >
                Sign In
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
}

export default Login;
