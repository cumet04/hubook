import { GraphQLClient } from "graphql-request";
import {
  Actor,
  Repository,
  IssueCommentConnection,
  IssueComment,
} from "./github-v4";
import Setting from "./setting";

export interface TQueryResult {
  repository: Repository;
}

export type Identifier = {
  owner: string;
  name: string;
  number: number;
};

export type Author = {
  avatarUrl: string;
  login: string;
};

export type Comment = {
  author: Author;
  body: string;
  publishedAt: Date;
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
    bodyHTML
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

export function mapAuthorData(actor: Actor | null | undefined): Author {
  if (!actor) {
    console.debug(actor);
    throw Error("author is empty");
  }

  return {
    avatarUrl: actor.avatarUrl,
    login: actor.login,
  };
}

export function mapCommentsData(comments: IssueCommentConnection) {
  const page = comments.pageInfo;
  const raws: IssueComment[] =
    comments.nodes?.filter((raw): raw is IssueComment => raw !== null) || [];
  return {
    comments: raws.map(
      (raw) =>
        ({
          author: mapAuthorData(raw.author),
          body: raw.bodyHTML,
          publishedAt: parseDate(raw.publishedAt),
        } as Comment)
    ),
    nextCommentCursor: page.hasNextPage ? page.endCursor || null : null,
  };
}
