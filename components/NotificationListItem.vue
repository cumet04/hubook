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
export default {
  props: ["notification"],
  computed: {
    iconColor() {
      return "green"; // TODO: tmp
    },
    iconData() {
      return "mdi-alert-circle-outline"; // TODO: tmp
    },
    subtitle() {
      return `${this.notification.reponame} #${this.notification.number}`;
    }
  }
};
</script>
