<template>
  <loginPage />
</template>

<script>
export default {
  components: {
    loginPage: () => import("../components/loginPage"),
  },
};
</script>
