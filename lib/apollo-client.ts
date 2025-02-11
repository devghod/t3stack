import {
  ApolloClient, 
  HttpLink, 
  InMemoryCache, 
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { useUserStore } from "@/stores/userStore";
const errorLink = onError(({ graphQLErrors, networkError }) => {  
  const { setGraphqlError } = useUserStore.getState();

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.log(">> graphQLErrors", message);
      setGraphqlError(message); 
    });
  }
  if (networkError) {
    console.log(">> networkError", networkError);
    setGraphqlError(networkError.message);
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`
    : "http://localhost:3000/api/graphql",
  }),
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export default client;
