<template>
  <div class="notification_list_item">
    <v-list-item>
      <v-list-item-icon dense>
        <v-icon :color="iconColor">{{ iconData }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="notification.title"></v-list-item-title>
        <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import { mdiSourceMerge } from "@mdi/js";
import { mdiSourcePull } from "@mdi/js";
import Issue from "~/services/issue";

export default {
  props: ["notification"],
  data: () => ({ subject: null }),
  mounted() {
    const identifier = this.notification.subjectIdentifier;
    if (this.notification.type == "Issue") {
      Issue.fetch({ identifier }).then((data) => {
        this.subject = data;
      });
    } else if (this.notification.type == "PullRequest") {
      this.$store.dispatch("pullreqs/fetch", { identifier }).then((data) => {
        this.subject = data;
      });
    }
  },
  computed: {
    iconColor() {
      return {
        open: "green",
        closed: "red",
        draft: "gray",
        merged: "purple",
      }[this.subject?.status];
    },
    iconData() {
      if (!this.subject) return "";

      if (this.notification.type == "Issue") {
        return "mdi-alert-circle-outline";
      } else if (this.notification.type == "PullRequest") {
        return this.subject.status == "merged" ? mdiSourceMerge : mdiSourcePull;
      }
    },
    subtitle() {
      const id = this.notification.subjectIdentifier;
      return `${id.owner}/${id.name} #${id.number}`;
    },
  },
};
</script>
