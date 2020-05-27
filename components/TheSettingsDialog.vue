<template>
  <v-dialog max-width="600px" :value="value" @input="change($event)">
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
        <v-btn color="primary" text @click="$emit('input', false)">Close</v-btn>
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
import Setting from "~/services/setting";

export default {
  props: ["value"],
  data: () => ({
    snackbar: false,
    githubApiBase: null,
    githubApiToken: null,
  }),
  methods: {
    change(event) {
      if (event) {
        // initialize data on open
        const auth = Setting.githubAuth();
        Object.assign(this.$data, {
          snackbar: false,
          githubApiBase: auth.baseUrl,
          githubApiToken: auth.token,
        });
      }
      this.$emit("input", event);
    },
    save() {
      Setting.setGithubAuth(
        this.githubApiBase || "",
        this.githubApiToken || ""
      );
      this.snackbar = true;
    },
  },
};
</script>
