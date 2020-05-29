<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon
      @click.stop="$emit('nav-icon-click')"
    ></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <the-settings-dialog v-model="settings" v-slot:default="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </the-settings-dialog>
  </v-app-bar>
</template>

<script>
import TheSettingsDialog from "~/components/TheSettingsDialog.vue";

export default {
  components: {
    "the-settings-dialog": TheSettingsDialog,
  },
  data: () => ({
    settings: false,
  }),
};
</script>
