<template>
  <v-card>
    <v-app-bar color="white" absolute app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img class="mr-2" src="../assets/logo.png" max-width="45"> </v-img>
        <span class="headline">
          Things to do!
        </span>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" bottom temporary app>
      <v-list>
        <v-list-item class="justify-center">
          <v-list-item-avatar max-width size="60">
            <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item>
          <v-list-item-content class="text-center">
            <v-list-item-title class="title">
              John Leider
            </v-list-item-title>
            <v-list-item-subtitle>john@vuetifyjs.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="justify-center">
          <v-btn outlined small color="primary">
            Log out
          </v-btn>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense rounded>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  data: () => {
    return {
      showMenu: false,
      drawer: false,
      group: null,
      selectedItem: 0,
      items: [
        { text: "My Files", icon: "mdi-folder" },
        { text: "Shared with me", icon: "mdi-account-multiple" },
        { text: "Starred", icon: "mdi-star" },
        { text: "Recent", icon: "mdi-history" },
        { text: "Offline", icon: "mdi-check-circle" },
        { text: "Uploads", icon: "mdi-upload" },
        { text: "Backups", icon: "mdi-cloud-upload" },
      ],
    };
  },
  /* watch: {
    group() {
      this.drawer = false;
    },
  }, */
};
</script>
