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
    <!-- 'timeout' requires number, but prettier formats 'timeout=2000' to timeout="2000" -->
    <v-snackbar v-model="snackbar" :timeout="2000" @click="snackbar = false">
      saved !
    </v-snackbar>
  </v-dialog>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      snackbar: false,
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
      this.snackbar = true;
    },
  },
};
</script>
