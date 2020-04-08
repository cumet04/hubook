import github from "~/plugins/github";

export const state = () => ({
  _all: [],
  _nextUpdate: null,
});

export const mutations = {
  setAll(state, value) {
    state._all = value;
  },
  setNextUpdate(state, value) {
    state._nextUpdate = value;
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
    const res = await github.listNotifications();
    commit("setNextUpdate", new Date(Date.now() + res.interval * 1000));
    commit("setAll", res.data.map(mapping));
  },
};

// API result object -> model data object
function mapping(apidata) {
  const data = {
    title: apidata.subject.title,
    type: apidata.subject.type,
    number: parseInt(apidata.subject.url.split("/").pop()), // TODO: fix hack
    repo: {
      owner: apidata.repository.owner.login, // TODO: org?
      name: apidata.repository.name,
    },
  };
  const subject = async () => {
    switch (data.type) {
      case "PullRequest":
        return await subjectPullRequest(
          data.repo.owner,
          data.repo.name,
          data.number
        );
    }
  };
  return { ...data, subject };
}

async function subjectPullRequest(owner, name, number) {
  const pr = await github.fetchPullRequest(owner, name, number);
  return {
    number: pr.number,
    title: pr.title,
    merged: pr.merger,
    closed: pr.closed,
  };
}
