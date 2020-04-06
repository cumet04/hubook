<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon
      @click.stop="$emit('nav-icon-click')"
    ></v-app-bar-nav-icon>
  </v-app-bar>
</template>
