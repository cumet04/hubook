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
  data: () => ({ subject: null }),
  mounted() {
    const identifier = this.notification.subjectIdentifier;
    if (this.notification.type == "Issue") {
      this.$store.dispatch("issues/fetch", { identifier }).then((data) => {
        this.subject = data;
      });
    } // else if
  },
  computed: {
    iconColor() {
      const s = this.subject;
      if (!s) return "";

      if (this.notification.type == "Issue") {
        return s.closed ? "red" : "green";
      } else if (this.notification.type == "PullRequest") {
        if (s.drafted) return "gray";
        else if (s.merged) return "purple";
        else if (s.closed) return "red";
        else return "green";
      }
    },
    iconData() {
      const s = this.subject;
      if (!s) return "";

      if (this.notification.type == "Issue") {
        return "mdi-alert-circle-outline";
      } else if (this.notification.type == "PullRequest") {
        return s.merged ? mdiSourceMerge : mdiSourcePull;
      }
    },
    subtitle() {
      const id = this.notification.subjectIdentifier;
      return `${id.owner}/${id.name} #${id.number}`;
    },
  },
};
</script>
