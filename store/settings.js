export const state = () => ({
  githubApiBase: null,
  githubApiToken: null,
});

export const mutations = {
  setGithubApiBase(state, value) {
    state.githubApiBase = value?.length ? value : null;
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
