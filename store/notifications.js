import github from "~/plugins/github";

export const state = () => ({
  _all: [],
});

export const mutations = {
  setAll(state, value) {
    state._all = value;
  },
};

export const getters = {
  all: (state) => state._all.concat([]),
  index: (_, getters) => (limit) => {
    return getters.all.slice(0, limit);
  },
};

export const actions = {
  async fetchNotifications({ store, commit }) {
    const data = await github.listNotifications();
    commit("setAll", data.map(mapping));
  },
};

// API result object -> model data object
function mapping(apidata) {
  return {
    title: apidata.subject.title,
    type: apidata.subject.type,
    number: apidata.subject.url.split("/").pop(), // TODO: fix hack
    reponame: apidata.repository.full_name,
  };
}
