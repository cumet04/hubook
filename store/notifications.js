import github from "~/plugins/github";

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
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  },
};

export const actions = {
  async fetchNotifications({ state, commit }) {
    const res = await github.listNotifications();
    commit("setNextUpdate", new Date(Date.now() + res.interval * 1000));
    const values = await Promise.all(
      res.data.map(async (raw) => {
        const value = mapping(raw);
        switch (value.type) {
          case "PullRequest":
            value.subject = await github.fetchPullRequest(
              value.repo.owner,
              value.repo.name,
              value.number
            );
            break;
        }
        return value;
      })
    );
    commit("upsertMulti", values);
  },
};

// API result object -> model data object
function mapping(apidata) {
  const data = {
    id: apidata.id,
    updatedAt: new Date(Date.parse(apidata.updated_at)),
    title: apidata.subject.title,
    type: apidata.subject.type,
    number: parseInt(apidata.subject.url.split("/").pop()), // TODO: fix hack
    repo: {
      owner: apidata.repository.owner.login, // TODO: org?
      name: apidata.repository.name,
    },
  };
  return data;
}
