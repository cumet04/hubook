import { GraphQLClient } from "graphql-request";
import { Repository, IssueCommentConnection } from "~/types/github-v4";
import Setting from "~/services/setting";

function qlClient() {
  const params = Setting.githubAuth();
  return new GraphQLClient(`${params.baseUrl}/graphql`, {
    headers: {
      authorization: `Bearer ${params.token}`,
    },
  });
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
      console.debug(raw);
      throw Error("request pullrequest failed");
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
      console.debug(raw);
      throw Error("request issue failed");
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
