<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon
      @click.stop="$emit('nav-icon-click')"
    ></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <v-btn icon nuxt to="/settings">
      <v-icon>mdi-cog</v-icon>
    </v-btn>
  </v-app-bar>
</template>
