import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

// Function to create Apollo Client with authentication token
export const createApolloClient = (getAccessToken: () => Promise<string>) => {
  // Setup HTTP connection to the API
  const httpLink = new HttpLink({
    uri: import.meta.env.VITE_API_URL,
  });

  // Middleware to add authentication token to every request
  const authLink = new ApolloLink((operation, forward) => {
    return new Promise((resolve) => {
      getAccessToken().then((token) => {
        // Add the token to the request headers
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
        });
        resolve(forward(operation));
      });
    });
  });

  // Combine the auth middleware with the HTTP link
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
