<template>
  <div class="issue_list_item">
    <v-list-item>
      <v-list-item-icon dense>
        <v-icon :color="iconColor">mdi-alert-circle-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="issue.title"></v-list-item-title>
        <v-list-item-subtitle>#{{ issue.number }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: ["issue"],
  computed: {
    iconColor() {
      return this.issue.closed ? "red" : "green";
    }
  }
};
</script>
