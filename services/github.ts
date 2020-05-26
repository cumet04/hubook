const GitHub = require("github-api"); // avoid ts error without d.ts
import { GraphQLClient } from "graphql-request";
import { NuxtApp } from "@nuxt/types/app";
import { Repository, IssueCommentConnection } from "~/types/github-v4";

// FIXME:
// @ts-ignore TS2304; Cannot find name '$nuxt'.
const store = () => ($nuxt as NuxtApp).$store;

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

function raise(res: any, msg: string) {
  console.group();
  console.error(msg);
  console.debug(res);
  console.groupEnd();
  throw msg;
}

function parseDate(datestr: string) {
  return new Date(Date.parse(datestr));
}

const authorQuery = () => `
author {
  avatarUrl
  login
}
`;

const commentsQuery = (per: number) => `
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

interface TQueryResult {
  repository: Repository;
}

function mapCommentsData(comments: IssueCommentConnection) {
  const page = comments.pageInfo;
  return {
    comments: comments.nodes?.map((raw) => {
      if (!raw) return null;
      raw.publishedAt = parseDate(raw.publishedAt);
      return raw;
    }),
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
      // FIXME: type
      // @ts-ignore TS7006
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
  async fetchPullRequest({
    owner,
    name,
    number,
  }: {
    owner: string;
    name: string;
    number: string;
  }) {
    const per = 5;
    const raw = (
      await qlClient().request<TQueryResult>(`
        query {
          repository(owner: "${owner}", name: "${name}") {
            pullRequest(number: ${number}) {
              number
              title
              baseRefName
              headRefName
              merged
              closed
              isDraft
              publishedAt
              ${authorQuery()}
              bodyText
              ${commentsQuery(per)}
            }
          }
        }
      `)
    ).repository.pullRequest;
    if (!raw) {
      raise(raw, "request pullrequest failed");
      return;
    }

    return {
      identifier: { owner, name, number },
      title: raw.title,
      baseRefName: raw.baseRefName,
      headRefName: raw.headRefName,
      status: (() => {
        if (raw.merged) return "merged";
        if (raw.isDraft) return "draft";
        if (raw.closed) return "closed";
        return "open";
      })(),
      author: raw.author,
      bodyText: raw.bodyText,
      publishedAt: parseDate(raw.publishedAt),
      ...mapCommentsData(raw.comments),
    };
  },
  async fetchIssue({
    owner,
    name,
    number,
  }: {
    owner: string;
    name: string;
    number: string;
  }) {
    const per = 5;
    const raw = (
      await qlClient().request<TQueryResult>(`
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
    if (!raw) {
      raise(raw, "request issue failed");
      return;
    }

    return {
      identifier: { owner, name, number },
      title: raw.title,
      status: raw.closed ? "closed" : "open",
      author: raw.author,
      bodyText: raw.bodyText,
      publishedAt: parseDate(raw.publishedAt),
      ...mapCommentsData(raw.comments),
    };
  },
};
