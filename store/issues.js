import github from "~/services/github";
import Vue from "vue";

export const state = () => ({
  _all: {},
});

function key(owner, name, number) {
  return `${owner}/${name}/${number}`;
}

export const mutations = {
  insert(state, value) {
    const repo = value.repository;
    const k = key(repo.owner, repo.name, value.number);
    Vue.set(state._all, k, value);
  },
};

export const getters = {
  find: (state) => (owner, name, number) => {
    return state._all[key(owner, name, number)];
  },
};

export const actions = {
  async fetch({ commit, getters }, { owner, name, number, force = false }) {
    if (!force) {
      const cache = getters.find(owner, name, number);
      if (cache) return cache;
    }
    const data = await github.fetchIssue({ owner, name, number });
    commit("insert", data);
    return getters.find(owner, name, number);
  },
};
