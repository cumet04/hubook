<template>
  <div class="notification_list_item">
    <v-list-item @click="click">
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
      switch (this.notification.type) {
        case "PullRequest":
          const pr = this.notification.subject;
          if (pr.drafted) return "gray";
          else if (pr.merged) return "purple";
          else if (pr.closed) return "red";
          else return "green";
        case "Issue":
          return "green";
        // return this.notification.subject.closed ? "red" : "green";
      }
    },
    iconData() {
      switch (this.notification.type) {
        case "PullRequest":
          const pr = this.notification.subject;
          if (pr.merged) return mdiSourceMerge;
          else return mdiSourcePull;
        case "Issue":
          return "mdi-alert-circle-outline";
      }
    },
    subtitle() {
      const n = this.notification;
      return `${n.repo.owner}/${n.repo.name} #${this.notification.number}`;
    },
  },
  methods: {
    click() {
      this.notification.subject().then((subject) => {
        alert(`merged: ${subject.merged}, closed: ${subject.closed}`);
      });
    },
  },
};
</script>
