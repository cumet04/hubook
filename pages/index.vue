<template>
  <div class="d-flex">
    <v-list two-line subheader class="flex-grow-1">
      <v-subheader>notifications</v-subheader>
      <v-list-item-group v-model="selectedIndex" color="accent">
        <template v-for="(item, index) in notifications">
          <v-divider v-if="index != 0" :key="item.id"></v-divider>
          <notification-list-item
            :key="index"
            :notification="item"
          ></notification-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    <v-divider vertical class="mx-4" v-if="selected"></v-divider>
    <v-expand-x-transition>
      <!-- for transition, separate block with v-if and block with min-width -->
      <div v-if="selected">
        <v-card elevation="0" style="min-width: 500px;">
          <issue-detail
            v-if="selectedType == 'Issue' && selectedSubject"
            :subject="selectedSubject"
          ></issue-detail>
          <pullrequest-detail
            v-if="selectedType == 'PullRequest' && selectedSubject"
            :subject="selectedSubject"
          ></pullrequest-detail>
        </v-card>
      </div>
    </v-expand-x-transition>
  </div>
</template>

<script>
import NotificationListItem from "~/components/NotificationListItem.vue";
import IssueDetail from "~/components/IssueDetail.vue";
import PullRequestDetail from "~/components/PullRequestDetail.vue";

import Notification from "~/services/notification";

export default {
  components: {
    "notification-list-item": NotificationListItem,
    "issue-detail": IssueDetail,
    "pullrequest-detail": PullRequestDetail,
  },
  data: () => ({
    selectedIndex: null,
    selectedSubject: null,
  }),
  mounted() {
    setTimeout(() => {
      Notification.fetch();
    }, 0); // TODO: tmp hack
  },
  computed: {
    notifications() {
      return Notification.list();
    },
    selected() {
      return this.notifications[this.selectedIndex];
    },
    selectedType() {
      return this.selected?.type;
    },
  },
  watch: {
    selectedIndex(newValue, oldValue) {
      if (newValue == null) return;

      const identifier = this.selected.subjectIdentifier;
      if (this.selectedType == "Issue") {
        this.$store.dispatch("issues/fetch", { identifier }).then((data) => {
          this.selectedSubject = data;
        });
      } else if (this.selectedType == "PullRequest") {
        this.$store.dispatch("pullreqs/fetch", { identifier }).then((data) => {
          this.selectedSubject = data;
        });
      }
    },
  },
};
</script>
