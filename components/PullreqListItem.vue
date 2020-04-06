<template>
  <div class="pullreq_list_item">
    <v-list-item>
      <v-list-item-icon dense>
        <v-icon :color="iconColor">{{ iconData }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="pullreq.title"></v-list-item-title>
        <v-list-item-subtitle>#{{ pullreq.number }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import { mdiSourceMerge } from "@mdi/js";
import { mdiSourcePull } from "@mdi/js";

export default {
  props: ["pullreq"],
  computed: {
    iconColor() {
      if (this.pullreq.merged) return "purple";
      else if (this.pullreq.closed) return "red";
      else return "green";
    },
    iconData() {
      if (this.pullreq.merged) return mdiSourceMerge;
      else return mdiSourcePull;
    },
  },
};
</script>
