import { useAuth0 } from "@auth0/auth0-react";
import { ApolloProvider } from "@apollo/client";
import { Box, Container, Spinner, Center } from "@chakra-ui/react";
import { createApolloClient } from "./apolloClient";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Show loading spinner while Auth0 is initializing
  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login />;
  }

  // Create Apollo Client with the auth token
  const client = createApolloClient(getAccessTokenSilently);

  // Show the main dashboard wrapped in Apollo Provider
  return (
    <ApolloProvider client={client}>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Dashboard />
        </Container>
      </Box>
    </ApolloProvider>
  );
}

export default App;
