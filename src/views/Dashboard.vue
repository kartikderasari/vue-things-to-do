<template>
  <div>
    <Navbar v-if="loggedIn" />
    <v-main>
      <tasksContainer v-if="loggedIn" />
    </v-main>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";

import tasksContainer from "../components/tasksContainer";

export default {
  name: "Home",
  components: {
    Navbar,
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
};
</script>
