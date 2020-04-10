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

function parseDate(datestr) {
  return new Date(Date.parse(datestr));
}

export default {
  async listNotifications(since = null) {
    const op = since ? { since } : {};
    const res = await gh().getUser().listNotifications(op);
    if (res.status != 200) raise(res, "get notifications failed");

    return {
      interval: res.headers["x-poll-interval"],
      notifications: res.data.map((raw) => {
        // MEMO: This application supposes that subject type is issue or pull-req.
        // I don't know the type can be except these...
        const type = raw.subject.type;
        if (type != "Issue" && type != "PullRequest") {
          raise(raw, "subject type is not issue nor pull-req");
        }

        return {
          id: raw.id,
          updatedAt: parseDate(raw.updated_at),
          lastReadAt: parseDate(raw.last_read_at),
          title: raw.subject.title,
          type: raw.subject.type,
          subject: {},
          number: parseInt(raw.subject.url.split("/").pop()), // TODO: fix hack
          repository: {
            owner: raw.repository.owner.login, // TODO: org?
            name: raw.repository.name,
          },
        };
      }),
    };
  },
  async fetchPullRequest({ owner, name, number }) {
    const raw = (
      await qlClient().request(`
        query {
          repository(owner: "${owner}", name: "${name}") {
            pullRequest(number: ${number}) {
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
      `)
    ).repository.pullRequest;

    return {
      repository: { owner, name },
      number: raw.number,
      title: raw.title,
      merged: raw.merged,
      closed: raw.closed,
      drafted: raw.isDraft,
      createdAt: parseDate(raw.createdAt),
      updatedAt: parseDate(raw.updatedAt),
    };
  },
  async fetchIssue({ owner, name, number }) {
    const raw = (
      await qlClient().request(`
        query {
          repository(owner: "${owner}", name: "${name}") {
            issue(number: ${number}) {
              number
              title
              closed
              createdAt
              updatedAt
            }
          }
        }
      `)
    ).repository.issue;

    return {
      repository: { owner, name },
      number: raw.number,
      title: raw.title,
      closed: raw.closed,
      createdAt: parseDate(raw.createdAt),
      updatedAt: parseDate(raw.updatedAt),
    };
  },
};
