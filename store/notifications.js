import github from "~/services/github";

export const state = () => ({
  _all: {},
  _nextUpdate: null,
});

export const mutations = {
  upsertMulti(state, values) {
    const news = {};
    for (let value of values) {
      news[value.id] = value;
    }
    state._all = Object.assign({}, state._all, news);
  },
  setNextUpdate(state, value) {
    state._nextUpdate = value;
  },
};

export const getters = {
  all: (state) => Object.values(state._all),
  index: (_, getters) => (limit) => {
    return getters.all
      .sort((a, b) => b.lastReadAt - a.lastReadAt)
      .slice(0, limit);
  },
};

export const actions = {
  async fetchNotifications({ commit }) {
    const { notifications, interval } = await github.listNotifications();
    await Promise.all(
      notifications.map(async (n) => {
        const info = {
          owner: n.repository.owner,
          name: n.repository.name,
          number: n.number,
        };
        if (n.type == "Issue") {
          n.summary = await github.fetchIssueSummary(info);
        } else if (n.type == "PullRequest") {
          n.summary = await github.fetchPullRequest(info);
        }
      })
    );
    commit("upsertMulti", notifications);
    commit("setNextUpdate", new Date(Date.now() + interval * 1000));
  },
};
