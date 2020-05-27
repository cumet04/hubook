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
