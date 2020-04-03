<template>
  <v-container class="pa-10">
    <v-list two-line subheader>
      <v-subheader>issues</v-subheader>
      <template v-for="(item, index) in issues">
        <v-divider v-if="index != 0" :key="item.number"></v-divider>
        <v-list-item :key="index">
          <v-list-item-icon dense>
            <v-icon :color="iconStyle(item)">mdi-alert-circle-outline</v-icon>
            <!-- mid-source-pull -->
            <!-- mid-source-merge -->
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle>#{{ item.number }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

export default {
  methods: {
    iconStyle(issue) {
      return issue.closed ? "red" : "green";
    }
  },
  apollo: {
    issues: {
      query: gql`
        {
          repository(owner: "rails", name: "rails") {
            issues(
              states: [OPEN, CLOSED]
              first: 20
              orderBy: { direction: DESC, field: UPDATED_AT }
            ) {
              nodes {
                number
                title
                closed
              }
            }
          }
        }
      `,
      update: ({ repository }) => repository.issues.nodes
    }
  }
};
</script>
