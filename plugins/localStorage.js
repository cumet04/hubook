import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: "vuex-hubook",
      paths: ["setting"],
    })(store);
  });
};
