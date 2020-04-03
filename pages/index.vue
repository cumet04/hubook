<template>
  <v-container class="pa-10">
    <v-list two-line subheader>
      <v-subheader>issues</v-subheader>
      <template v-for="(item, index) in issues">
        <v-divider v-if="index != 0" :key="item.number"></v-divider>
        <v-list-item :key="item.number">
          <v-list-item-icon dense>
            <v-icon color="green">mdi-alert-circle-outline</v-icon>
            <!-- mid-source-pull -->
            <!-- mid-source-merge -->
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle v-text="item.number"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    issues: [
      { title: "some title", number: 1 },
      { title: "some title 2", number: 2 },
      { title: "some title 3", number: 3 }
    ]
  })
};
</script>
