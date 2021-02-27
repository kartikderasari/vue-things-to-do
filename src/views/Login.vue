<template>
  <v-main class="grey lighten-2">
    <loginPage />
  </v-main>
</template>

<script>
export default {
  components: {
    loginPage: () => import("../components/loginPage"),
  },
};
</script>
