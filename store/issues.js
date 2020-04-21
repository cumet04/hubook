import github from "~/services/github";
import Vue from "vue";

export const state = () => ({
  _all: {},
});

function key(id) {
  return `${id.owner}/${id.name}/${id.number}`;
}

export const mutations = {
  insert(state, value) {
    Vue.set(state._all, key(value.identifier), value);
  },
};

export const getters = {
  find: (state) => (identifier) => {
    return state._all[key(identifier)];
  },
};

export const actions = {
  async fetch({ commit, getters }, { identifier, force = false }) {
    if (!force) {
      console.log(identifier);
      const cache = getters.find(identifier);
      if (cache) return cache;
    }
    const data = await github.fetchIssue(identifier);
    commit("insert", data);
    return getters.find(identifier);
  },
};
