import github from "~/services/pullRequest";

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
  list: (_, getters) => (start, end) => {
    return getters.all
      .sort((a, b) => b.lastReadAt - a.lastReadAt)
      .slice(start, end);
  },
};

export const actions = {
  async fetchNotifications({ commit }) {
    const { notifications, interval } = await github.listNotifications();
    commit("upsertMulti", notifications);
    commit("setNextUpdate", new Date(Date.now() + interval * 1000));
  },
};
