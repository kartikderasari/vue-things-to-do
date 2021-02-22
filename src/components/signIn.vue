<template>
  <v-container>
    <v-row class="mt-15" align="center" justify="center">
      <v-col>
        <v-sheet
          class="py-15"
          align="center"
          color="white"
          elevation="3"
          outlined
          rounded
        >
          <v-img class="mb-4" src="../assets/logo.png" width="200"></v-img>
          <h2 class="font-weight-medium">Things to do!</h2>
          <p>A simple solution to help you manage your tasks ✔</p>
          <v-btn color="primary" elevation="2" raised @click="googleLogin()">
            Sign in with Google
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FDK from "../config/firebase";
//console.log(auth);
var provider = new FDK.auth.GoogleAuthProvider();

export default {
  methods: {
    googleLogin: () => {
      provider.addScope("https://www.googleapis.com/auth/plus.login");
      FDK.auth().signInWithRedirect(provider);
      FDK.auth()
        .getRedirectResult()
        .then((result) => {
          if (result.credential) {
            console.log("Works");
          }
          var user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
