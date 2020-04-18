<template>
  <div class="d-flex">
    <v-list two-line subheader class="flex-grow-1">
      <v-subheader>notifications</v-subheader>
      <v-list-item-group v-model="selected" color="accent">
        <template v-for="(item, index) in notifications">
          <v-divider v-if="index != 0" :key="item.id"></v-divider>
          <notification-list-item
            :key="index"
            :notification="item"
          ></notification-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    <v-divider vertical class="mx-4" v-show="detailOpen"></v-divider>
    <v-expand-x-transition>
      <div v-show="detailOpen">
        <v-card elevation="0" style="min-width: 500px;">
          <v-subheader>issue</v-subheader>
          aaa
        </v-card>
      </div>
    </v-expand-x-transition>
  </div>
</template>

<script>
import NotificationListItem from "~/components/NotificationListItem.vue";

export default {
  components: {
    "notification-list-item": NotificationListItem,
  },
  data: () => ({
    selected: null,
  }),
  mounted() {
    setTimeout(() => {
      this.$store.dispatch("notifications/fetchNotifications");
    }, 0); // TODO: tmp hack
  },
  computed: {
    notifications() {
      return this.$store.getters["notifications/index"](5);
    },
    detailOpen() {
      return this.selected != null;
    },
  },
};
</script>
