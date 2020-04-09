<template>
  <div class="content">
    <v-list two-line subheader>
      <v-subheader>notifications</v-subheader>
      <template v-for="(item, index) in notifications">
        <v-divider v-if="index != 0" :key="item.id"></v-divider>
        <notification-list-item
          :key="index"
          :notification="item"
        ></notification-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import NotificationListItem from "~/components/NotificationListItem.vue";

export default {
  components: {
    "notification-list-item": NotificationListItem,
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch("notifications/fetchNotifications");
    }, 0); // TODO: tmp hack
  },
  computed: {
    notifications() {
      return this.$store.getters["notifications/index"](5);
    },
  },
};
</script>
