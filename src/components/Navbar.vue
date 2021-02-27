<template>
  <v-card>
    <v-app-bar color="white" app clipped-left outlined>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img class="mr-2" src="../assets/logo.png" max-width="45"> </v-img>
        <span class="headline">
          Things to do!
        </span>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" bottom clipped app width="200">
      <v-list>
        <v-list-item class="justify-center">
          <v-list-item-avatar max-width size="60">
            <v-img :src="userProfilePhoto"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item>
          <v-list-item-content class="text-center">
            <v-list-item-title class="title">
              {{ userName }}
            </v-list-item-title>
            <v-list-item-subtitle> {{ userEmail }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="justify-center">
          <v-btn outlined small color="primary" @click="logoutUser()">
            Log out
          </v-btn>
        </v-list-item>

        <v-list-item class="justify-center">
          <v-list-item-content class="text-center">
            <v-list-item-subtitle class="caption">
              © Created by
              <a
                class="text-decoration-none"
                href="https://github.com/kartikderasari"
                target="_blank"
                >Kartik Derasari</a
              >
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import FDK from "../config/firebase";

export default {
  data: () => {
    return {
      showMenu: false,
      drawer: true,
      group: null,
      userName: "",
      userProfilePhoto: "",
      userEmail: "",
    };
  },
  methods: {
    checkState: function() {
      let ref = this;
      FDK.auth().onAuthStateChanged(function(user) {
        if (user) {
          ref.userName = user.displayName;
          ref.userProfilePhoto = user.photoURL;
          ref.userEmail = user.email;
        } else {
          window.location.href = "./";
        }
      });
    },
    logoutUser: function() {
      FDK.auth()
        .signOut()
        .then(() => {
          window.location.href = "./";
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created: function() {
    if (window.innerWidth <= 990) {
      this.drawer = false;
    } else {
      this.drawer = true;
    }
  },
  mounted: function() {
    this.checkState();
  },
};
</script>
