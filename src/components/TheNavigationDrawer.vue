<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    temporary
  >
    <v-list>
      <v-list-item
        nuxt
        link
        :to="item.path"
        v-for="(item, i) in links"
        :key="i"
      >
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["value"],
  data: () => ({
    links: [{ title: "index", path: "/" }],
  }),
};
</script>
