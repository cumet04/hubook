import { Octokit } from "@octokit/rest";
import Setting from "~/services/setting";

const store = () => window.$nuxt.$store;

function octokit() {
  const params = Setting.githubAuth();
  const res = new Octokit({
    baseUrl: params.baseUrl,
    auth: params.token,
  });
  return res;
}

type Notification = {
  id: string;
  updatedAt: Date;
  lastReadAt: Date;
  title: string;
  type: string;
  subjectIdentifier: {
    owner: string;
    name: string;
    number: number;
  };
};

function parseDate(datestr: string) {
  return new Date(Date.parse(datestr));
}

async function listNotifications(since: Date | null = null) {
  const op = since ? { since: since.toISOString() } : {};
  const res = await octokit().activity.listNotificationsForAuthenticatedUser(
    op
  );
  if (res.status != 200) {
    console.debug(res);
    throw Error("get notifications failed");
  }

  const pollInterval = (() => {
    const raw = res.headers["x-poll-interval"];
    if (raw === undefined) throw Error("x-poll-interval is not found");
    return typeof raw === "number" ? raw : parseInt(raw);
  })();

  return {
    interval: pollInterval,
    notifications: res.data.map((raw) => {
      // MEMO: This application supposes that subject type is issue or pull-req.
      // I don't know the type can be except these...
      const type = raw.subject.type;
      if (type != "Issue" && type != "PullRequest") {
        console.debug(res);
        throw Error("subject type is not issue nor pull-req");
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
          number: parseInt(raw.subject.url.split("/").pop() || ""), // TODO: fix hack
        },
      } as Notification;
    }),
  };
}

export default {
  async fetch(options: { forceRefresh?: boolean }) {
    // TODO: forceRefresh
    // normal -> only new from before fetch
    // force -> fetch all without filter
    const { notifications, interval } = await listNotifications();
    store().commit("notification/upsertMulti", notifications);
    store().commit(
      "notification/setNextUpdate",
      new Date(Date.now() + interval * 1000)
    );
    return notifications;
  },
  list(options: { start?: number; end?: number } = {}) {
    return store().getters["notification/list"](
      options.start,
      options.end
    ) as Notification[];
  },
};
