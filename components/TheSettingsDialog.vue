<template>
  <v-dialog max-width="600px" :value="value" @input="$emit('input', $event)">
    <template v-slot:activator="{ on }">
      <slot v-bind:on="on"></slot>
    </template>
    <v-card>
      <v-card-title>Settings</v-card-title>
      <v-card-text>
        <v-form>
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
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">Close</v-btn>
        <v-btn color="primary" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      githubApiBase: this.$store.state.settings.githubApiBase,
      githubApiToken: null,
    };
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    save() {
      this.$store.dispatch("settings/setGithubApiParams", {
        base: this.githubApiBase,
        token: this.githubApiToken,
      });
      this.close();
      // TODO: alert
    },
  },
};
</script>
