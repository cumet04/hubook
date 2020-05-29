import { GraphQLClient } from "graphql-request";
import { Repository, IssueCommentConnection, IssueComment } from "./github-v4";
import Setting from "./setting";

export interface TQueryResult {
  repository: Repository;
}

export type Identifier = {
  owner: string;
  name: string;
  number: number;
};

export const authorQuery = () => `
author {
  avatarUrl
  login
}
`;

export const commentsQuery = (per: number) => `
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

export function qlClient() {
  const params = Setting.githubAuth();
  return new GraphQLClient(`${params.baseUrl}/graphql`, {
    headers: {
      authorization: `Bearer ${params.token}`,
    },
  });
}

export function parseDate(datestr: string) {
  return new Date(Date.parse(datestr));
}

export function mapCommentsData(comments: IssueCommentConnection) {
  const page = comments.pageInfo;
  return {
    comments:
      comments.nodes
        ?.filter((raw): raw is IssueComment => raw !== null)
        .map((raw) => {
          raw.publishedAt = parseDate(raw.publishedAt);
          return raw;
        }) || [],
    nextCommentCursor: page.hasNextPage ? page.endCursor || null : null,
  };
}
