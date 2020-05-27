import { IssueComment, Actor } from "~/types/github-v4";
import {
  TQueryResult,
  Identifier,
  authorQuery,
  commentsQuery,
  qlClient,
  parseDate,
  mapCommentsData,
} from "~/services/issueUtil";

const store = () => window.$nuxt.$store;

type PullRequest = {
  identifier: Identifier;
  title: string;
  baseRefName: string;
  headRefName: string;
  status: "open" | "draft" | "merged" | "closed";
  author: Actor;
  bodyText: string;
  publishedAt: Date;
  comments: IssueComment[];
  nextCommentCursor: string | null;
};

async function fetchPullRequest({
  owner,
  name,
  number,
}: Identifier): Promise<PullRequest> {
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
  if (!raw.author) {
    console.debug(raw);
    throw Error("issue author is empty");
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
}

export default {
  async fetch({
    identifier,
    force = false,
  }: {
    identifier: Identifier;
    force: boolean;
  }) {
    if (!force) {
      const cache = store().getters["pullRequest/find"](identifier);
      if (cache) return cache;
    }
    const data = await fetchPullRequest(identifier);
    store().commit("pullRequest/insert", data);
    return store().getters["pullRequest/find"](identifier);
  },
};
