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
      state.githubApiBase = value.endsWith("/") ? value : `${value}/`;
    }
  },
  setGithubApiToken(state, value) {
    state.githubApiToken = value?.length ? value : null;
  },
};

export const actions = {
  setGithubApiParams({ commit }, { base, token }) {
    commit("setGithubApiBase", base);
    commit("setGithubApiToken", token);
    this.app.apolloProvider.clients.defaultClient.cache.reset();
  },
};
