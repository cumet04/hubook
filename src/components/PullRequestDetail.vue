<template>
  <div>
    <v-subheader>
      <span>
        <b>{{ subject.author.login }}</b>
        {{ subject.status == "merged" ? "merged" : "wants to merge" }} into
        <code>{{ subject.baseRefName }}</code> from
        <code>{{ subject.headRefName }}</code>
        {{ formatDate(subject.publishedAt) }}
      </span>
    </v-subheader>
    <v-list three-line>
      <template v-for="(comment, i) in comments">
        <v-divider :key="comment.id" v-if="i != 0"></v-divider>
        <v-list-item :key="comment.id">
          <v-list-item-avatar>
            <v-img :src="comment.author.avatarUrl"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>
              <b>{{ comment.author.login }}</b> commented at
              {{ formatDate(comment.publishedAt) }}
            </v-list-item-subtitle>
            <v-list-item-content>
              <markdown-content :content="comment.body"></markdown-content>
            </v-list-item-content>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import MarkdownContent from "~/components/MarkdownContent.vue";

export default {
  props: ["subject"],
  components: {
    "markdown-content": MarkdownContent,
  },
  methods: {
    formatDate(date) {
      return date.toUTCString();
    },
  },
  computed: {
    comments() {
      const { author, body, publishedAt } = this.subject;
      return [{ author, body, publishedAt }, ...this.subject.comments];
    },
  },
};
</script>
