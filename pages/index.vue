<template>
  <div class="content">
    <v-list two-line subheader>
      <v-subheader>notifications</v-subheader>
      <template v-for="(item, index) in notifications">
        <v-divider v-if="index != 0" :key="item.number"></v-divider>
        <notification-list-item
          :key="index"
          :notification="item"
        ></notification-list-item>
      </template>
    </v-list>
    <v-toolbar>
      <v-text-field v-model="repo"></v-text-field>
    </v-toolbar>
    <v-list two-line subheader>
      <v-subheader>issues</v-subheader>
      <template v-for="(item, index) in issues">
        <v-divider v-if="index != 0" :key="item.number"></v-divider>
        <issue-list-item :key="index" :issue="item"> </issue-list-item>
      </template>
    </v-list>
    <v-list two-line subheader>
      <v-subheader>pull requests</v-subheader>
      <template v-for="(item, index) in pulls">
        <v-divider v-if="index != 0" :key="item.number"></v-divider>
        <pullreq-list-item :key="index" :pullreq="item"></pullreq-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import issuesQuery from "~/apollo/queries/issues";
import pullsQuery from "~/apollo/queries/pulls";
import IssueListItem from "~/components/IssueListItem.vue";
import PullreqListItem from "~/components/PullreqListItem.vue";
import NotificationListItem from "~/components/NotificationListItem.vue";
import GitHub from "github-api";

export default {
  components: {
    "issue-list-item": IssueListItem,
    "pullreq-list-item": PullreqListItem,
    "notification-list-item": NotificationListItem,
  },
  data: () => ({
    repo: "rails/rails",
    notifications: [],
  }),
  async asyncData() {
    const me = new GitHub({
      token: localStorage.getItem("github_token"),
    }).getUser();

    const res = await me.listNotifications();
    if (res.status != 200) {
      // TODO: err handle
      console.error("get notifications failed");
      return {};
    }

    const notifications = res.data.map((n) => ({
      title: n.subject.title,
      type: n.subject.type,
      number: n.subject.url.split("/").pop(), // TODO: fix hack
      reponame: n.repository.full_name,
    }));

    return {
      notifications: notifications,
    };
  },
  apollo: {
    issues: {
      query: issuesQuery,
      variables() {
        return {
          owner: this.repo.split("/")[0],
          name: this.repo.split("/")[1],
        };
      },
      update: ({ repository }) => repository.issues.nodes,
    },
    pulls: {
      query: pullsQuery,
      variables() {
        return {
          owner: this.repo.split("/")[0],
          name: this.repo.split("/")[1],
        };
      },
      update: ({ repository }) => repository.pullRequests.nodes,
    },
  },
};
</script>
