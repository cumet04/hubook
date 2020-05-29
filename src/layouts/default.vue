<template>
  <v-app>
    <the-navigation-drawer v-model="drawer"></the-navigation-drawer>
    <the-app-bar @nav-icon-click="drawer = !drawer"></the-app-bar>
    <v-content>
      <v-container fluid class="pa-10">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import TheNavigationDrawer from "~/components/TheNavigationDrawer.vue";
import TheAppBar from "~/components/TheAppBar.vue";

export default {
  components: {
    "the-navigation-drawer": TheNavigationDrawer,
    "the-app-bar": TheAppBar,
  },
  data: () => ({
    drawer: false,
  }),
};
</script>
