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
  </v-container>
</template>

<script>
import issuesQuery from "~/apollo/queries/issues";
import pullsQuery from "~/apollo/queries/pulls";
import IssueListItem from "~/components/IssueListItem.vue";
import PullreqListItem from "~/components/PullreqListItem.vue";

export default {
  components: {
    "issue-list-item": IssueListItem,
    "pullreq-list-item": PullreqListItem
  },
  data: () => ({
    repo: "rails/rails"
  }),
  apollo: {
    issues: {
      query: issuesQuery,
      variables() {
        return {
          owner: this.repo.split("/")[0],
          name: this.repo.split("/")[1]
        };
      },
      update: ({ repository }) => repository.issues.nodes
    },
    pulls: {
      query: pullsQuery,
      variables() {
        return {
          owner: this.repo.split("/")[0],
          name: this.repo.split("/")[1]
        };
      },
      update: ({ repository }) => repository.pullRequests.nodes
    }
  }
};
</script>
