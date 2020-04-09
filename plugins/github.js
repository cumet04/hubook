import GitHub from "github-api";
import { GraphQLClient } from "graphql-request";

function gh() {
  const res = new GitHub({
    apiBase: $nuxt.$store.getters["settings/githubApiBase"], // TODO: for ghe
    token: $nuxt.$store.state.settings.githubApiToken,
  });
  return res;
}

function qlClient() {
  const endpoint = `${$nuxt.$store.getters["settings/githubApiBase"]}graphql`;
  const token = $nuxt.$store.state.settings.githubApiToken;
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
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
    const query = `
      query($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          pullRequest(number: $number) {
            number
            title
            merged
            closed
            isDraft
            createdAt
            updatedAt
          }
        }
      }
    `;

    const raw = (
      await qlClient().request(query, {
        owner,
        name,
        number,
      })
    ).repository.pullRequest;

    return {
      repository: { owner, name },
      number: raw.number,
      title: raw.title,
      merged: raw.merged,
      closed: raw.closed,
      drafted: raw.isDraft,
      createdAt: new Date(Date.parse(raw.createdAt)),
      updatedAt: new Date(Date.parse(raw.updatedAt)),
    };
  },
  async fetchIssue(owner, name, number) {
    const query = `
      query($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          issue(number: $number) {
            number
            title
            closed
            createdAt
            updatedAt
          }
        }
      }
    `;

    const raw = (
      await qlClient().request(query, {
        owner,
        name,
        number,
      })
    ).repository.issue;

    return {
      repository: { owner, name },
      number: raw.number,
      title: raw.title,
      closed: raw.closed,
      createdAt: new Date(Date.parse(raw.createdAt)),
      updatedAt: new Date(Date.parse(raw.updatedAt)),
    };
  },
};
