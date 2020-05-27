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

type Issue = {
  identifier: Identifier;
  title: string;
  status: "open" | "closed";
  author: Actor;
  bodyText: string;
  publishedAt: Date;
  comments: IssueComment[];
  nextCommentCursor: string | null;
};

async function fetchIssue({ owner, name, number }: Identifier): Promise<Issue> {
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
  if (!raw.author) {
    console.debug(raw);
    throw Error("issue author is empty");
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
      const cache = store().getters["issue/find"](identifier);
      if (cache) return cache;
    }
    const data = await fetchIssue(identifier);
    store().commit("issue/insert", data);
    return store().getters["issue/find"](identifier);
  },
};
