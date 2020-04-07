import { InMemoryCache } from "apollo-cache-inmemory";

export default ({ store }) => {
  return {
    httpEndpoint: "https://api.github.com/graphql", // TODO:
    getAuth: () => {
      const token = store.state.settings.githubApiToken;
      return `bearer ${token}`;
    },
    cache: new InMemoryCache(),
  };
};
