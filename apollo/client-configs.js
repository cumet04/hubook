import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

export default () => {
  const httpLink = new HttpLink({ uri: "https://api.github.com/graphql" });

  // auth token
  const token = localStorage.getItem("github_token");

  // middleware
  const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: { Authorization: `bearer ${token}` },
    });
    return forward(operation);
  });
  const link = middlewareLink.concat(httpLink);
  return {
    link,
    cache: new InMemoryCache(),
  };
};
