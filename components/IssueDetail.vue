<template>
  <div>
    <v-card-subtitle>
      {{ this.subject.author.login }} opened this issue at
      {{ this.subject.publishedAt }}
    </v-card-subtitle>
    <v-list three-line>
      <v-card v-for="comment in comments" :key="comment.id">
        <v-list-item>
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
      </v-card>
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
