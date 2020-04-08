import GitHub from "github-api";
import PullRequestQuery from "~/apollo/queries/PullRequest.gql";

function gh() {
  const res = new GitHub({
    apiBase: $nuxt.$store.state.settings.githubApiBase,
    token: $nuxt.$store.state.settings.githubApiToken,
  });
  return res;
}

function apollo() {
  return $nuxt.$apollo;
}

function raise(res, msg) {
  console.group();
  console.error(msg);
  console.debug(res);
  console.groupEnd();
  throw msg;
}

export default {
  async listNotifications(since = null) {
    const op = since ? { since } : {};
    const res = await gh().getUser().listNotifications(op);
    if (res.status != 200) raise(res, "get notifications failed");

    return {
      data: res.data,
      interval: res.headers["x-poll-interval"],
    };
  },
  async fetchPullRequest(owner, name, number) {
    const res = await apollo().query({
      query: PullRequestQuery,
      variables: { owner, name, number },
    });
    return res.data.repository.pullRequest;
  },
};
