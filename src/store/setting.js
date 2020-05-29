export const state = () => ({
  githubApiBase: null,
  githubApiToken: null,
});

export const mutations = {
  setGithubApiBase(state, value) {
    state.githubApiBase = value;
  },
  setGithubApiToken(state, value) {
    state.githubApiToken = value;
  },
};
