<template>
  <div>
    <v-subheader>
      {{ this.subject.author.login }} opened this issue at
      {{ this.subject.publishedAt }}
    </v-subheader>
    <v-list three-line>
      <template v-for="(comment, i) in comments">
        <v-divider :key="comment.id" v-if="i != 0"></v-divider>
        <v-list-item :key="comment.id">
          <v-list-item-avatar>
            <v-img :src="comment.author.avatarUrl"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle
              >{{ comment.author.login }} commented at
              {{ comment.publishedAt }}</v-list-item-subtitle
            >
            <v-list-item-content>
              {{ comment.bodyText }}
            </v-list-item-content>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  props: ["subject"],
  computed: {
    comments() {
      const { author, bodyText, publishedAt } = this.subject;
      return [{ author, bodyText, publishedAt }, ...this.subject.comments];
    },
  },
};
</script>
