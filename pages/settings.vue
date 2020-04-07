<template>
  <v-form v-model="valid">
    <v-text-field
      v-model="githubApiBase"
      label="GitHub API base URL (GHE only)"
      hint="Set https://your.ghe.domain instead of https://your.ghe.domain/api/v3"
    >
    </v-text-field>
    <v-text-field
      v-model="githubApiToken"
      label="GitHub API token"
    ></v-text-field>
    <v-btn color="primary" @click="save">Save</v-btn>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      githubApiBase: this.$store.state.settings.githubApiBase,
      githubApiToken: null,
    };
  },
  methods: {
    save() {
      this.$store.dispatch("settings/setGithubApiParams", {
        base: this.githubApiBase,
        token: this.githubApiToken,
      });
      // TODO: alert
    },
  },
};
</script>
