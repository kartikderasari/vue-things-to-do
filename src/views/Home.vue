<template>
  <div>
    <Navbar v-if="loggedIn" />
    <v-main>
      <signIn v-if="!loggedIn" />
      <tasksContainer v-if="loggedIn" />
    </v-main>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import signIn from "../components/signIn";
import tasksContainer from "../components/tasksContainer";
import { auth } from "../config/firebase";

export default {
  name: "Home",
  components: {
    Navbar,
    signIn,
    tasksContainer,
  },
  data: () => ({
    loggedIn: true,
  }),
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    checkState: () => {
      auth.onAuthStateChanged(function(user) {
        if (user) {
          //this.loggedIn = true;
        } else {
          //this.loggedIn = false;
        }
      });
    },
  },
};
</script>
