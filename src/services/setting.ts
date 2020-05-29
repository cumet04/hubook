const store = () => window.$nuxt.$store;

type GithubAuth = {
  baseUrl: string;
  token: string;
};

const DefaultGithubBaseUrl = "https://api.github.com";

function normalizeGithubBaseUrl(raw: string): string | null {
  // return null for fallback to default, if empty
  if (raw.length === 0) return null;

  // trim trailing slash
  return raw.endsWith("/") ? raw.substring(0, raw.length - 1) : raw;
}

function normalizeGithubToken(raw: string): string | null {
  if (raw.length === 0) return null;
  return raw;
}

export default {
  githubAuth(): GithubAuth {
    return {
      baseUrl: store().state.setting.githubApiBase || DefaultGithubBaseUrl,
      token: store().state.setting.githubApiToken,
    };
  },
  setGithubAuth(base: string, token: string) {
    store().commit("setting/setGithubApiBase", normalizeGithubBaseUrl(base));
    store().commit("setting/setGithubApiToken", normalizeGithubToken(token));
  },
};
