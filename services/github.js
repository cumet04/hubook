import GitHub from "github-api";
import { GraphQLClient } from "graphql-request";

const store = () => $nuxt.$store;

function gh() {
  const res = new GitHub({
    apiBase: store().getters["settings/githubApiBase"], // TODO: for ghe
    token: store().state.settings.githubApiToken,
  });
  return res;
}

function qlClient() {
  const endpoint = `${store().getters["settings/githubApiBase"]}graphql`;
  const token = store().state.settings.githubApiToken;
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

const authorQuery = () => `
author {
  avatarUrl
  login
}
`;

const commentsQuery = (per) => `
comments(first: ${per}) {
  nodes {
    ${authorQuery()}
    bodyText
    publishedAt
  }
  pageInfo {
    hasNextPage
    endCursor
  }
}
`;

function mapCommentsData(data) {
  const page = data.comments.pageInfo;
  return {
    comments: data.comments.nodes,
    nextCommentCursor: page.hasNextPage ? page.endCursor : null,
  };
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
          subjectIdentifier: {
            owner: raw.repository.owner.login, // TODO: org?
            name: raw.repository.name,
            number: parseInt(raw.subject.url.split("/").pop()), // TODO: fix hack
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
      identifier: { owner, name, number },
      title: raw.title,
      merged: raw.merged, // TODO: to status string
      closed: raw.closed,
      drafted: raw.isDraft,
      // TODO: detail
    };
  },
  async fetchIssue({ owner, name, number }) {
    const per = 5;
    const raw = (
      await qlClient().request(`
        query {
          repository(owner: "${owner}", name: "${name}") {
            issue(number: ${number}) {
              number
              title
              closed
              publishedAt
              ${authorQuery()}
              bodyText
              ${commentsQuery(per)}
            }
          }
        }
      `)
    ).repository.issue;

    return {
      identifier: { owner, name, number },
      title: raw.title,
      closed: raw.closed,
      author: raw.author,
      bodyText: raw.bodyText,
      publishedAt: parseDate(raw.publishedAt),
      ...mapCommentsData(raw),
    };
  },
};
