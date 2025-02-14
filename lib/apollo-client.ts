import {
  ApolloClient, 
  HttpLink, 
  InMemoryCache, 
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {  

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.log(">> graphQLErrors", message);
    });
  }
  if (networkError) {
    console.log(">> networkError", networkError);
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`
    : "http://localhost:3000/api/graphql",
  }),
]);

const cache = new InMemoryCache({
  typePolicies: {},
});

const client = new ApolloClient({
  link: link,
  cache,
  defaultOptions: {
    watchQuery: { fetchPolicy: "no-cache" },
    query: { fetchPolicy: "no-cache" },
  },
});
await client.clearStore(); 

export default client;
