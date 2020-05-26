export const state = () => ({
  githubApiBase: null,
  githubApiToken: null,
});

export const mutations = {
  setGithubApiBase(state, value) {
    if (!value || !value.length) {
      // null or empty
      state.githubApiBase = null;
    } else if (value.match(/https:\/\/api\.github\.com\/?/)) {
      // explicit github.com => null
      state.githubApiBase = null;
    } else {
      // (ghe) normalize trailing slash
      state.githubApiBase = value.endsWith("/")
        ? value.substring(0, valie.length - 1)
        : value;
    }
  },
  setGithubApiToken(state, value) {
    state.githubApiToken = value?.length ? value : null;
  },
};

export const getters = {
  githubApiBase(state) {
    return state.githubApiBase || "https://api.github.com";
  },
};

export const actions = {
  setGithubApiParams({ commit }, { base, token }) {
    commit("setGithubApiBase", base);
    commit("setGithubApiToken", token);
  },
};
