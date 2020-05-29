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
