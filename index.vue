<template>
  <v-container class="pa-10">
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
    <v-list subheader>
      <v-subheader>notifications</v-subheader>
      <template v-for="(item, index) in notifications">
        <v-divider v-if="index != 0" :key="item.number"></v-divider>
        <v-list-item :key="item.number">
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>

<script>
import issuesQuery from "~/apollo/queries/issues";
import pullsQuery from "~/apollo/queries/pulls";
import IssueListItem from "~/components/IssueListItem.vue";
import PullreqListItem from "~/components/PullreqListItem.vue";
import GitHub from "github-api";

export default {
  components: {
    "issue-list-item": IssueListItem,
    "pullreq-list-item": PullreqListItem,
  },
  data: () => ({
    repo: "rails/rails",
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

    const notifications = res.data.map(async (n) => {
      const info = await this.getSubjectInfo(n.subject.type, n.subject.url);
      return {
        title: n.subject.title,
        type: n.subject.type,
        url: info.url,
      };
    });

    return {
      notifications: await Promise.all(notifications),
    };
  },
  methods: {
    async getSubjectInfo(type, url) {
      const gh = new GitHub({ token: localStorage.getItem("github_token") });
      switch (type) {
        case "PullRequest":
          const id = url.split("/").pop();
          const pr = await gh.getRepository().getPullRequest(id);
          // if err
          return {
            url: pr.data.html_url,
          };
      }
    },
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
