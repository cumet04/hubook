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

export default {
  props: ["notification"],
  computed: {
    iconColor() {
      const n = this.notification;
      if (n.type == "Issue") {
        return n.subject.closed ? "red" : "green";
      } else if (n.type == "PullRequest") {
        if (n.subject.drafted) return "gray";
        else if (n.subject.merged) return "purple";
        else if (n.subject.closed) return "red";
        else return "green";
      }
    },
    iconData() {
      const n = this.notification;
      if (n.type == "Issue") {
        return "mdi-alert-circle-outline";
      } else if (n.type == "PullRequest") {
        return n.subject.merged ? mdiSourceMerge : mdiSourcePull;
      }
    },
    subtitle() {
      const n = this.notification;
      return `${n.repository.owner}/${n.repository.name} #${n.number}`;
    },
  },
};
</script>
