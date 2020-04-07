import GitHub from "github-api";

function gh() {
  const res = new GitHub({
    apiBase: $nuxt.$store.state.settings.githubApiBase,
    token: $nuxt.$store.state.settings.githubApiToken,
  });
  return res;
}

function raise(res, msg) {
  console.group();
  console.error(msg);
  console.debug(res);
  console.groupEnd();
  throw msg;
}

export default {
  async listNotifications() {
    const res = await gh().getUser().listNotifications();
    if (res.status != 200) raise(res, "get notifications failed");

    return res.data;
  },
};
