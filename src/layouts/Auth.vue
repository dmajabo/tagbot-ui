<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import authService from "../services/auth";

export default {
  data() {
    return {}
  },
  created() {
    console.log("Login initiated..")
    if (authService.isAuthenticated()) {
      console.log("You're already authenticated.")
      this.$goTo('dashboard')
    } else {
      this.$goTo('login')
    }
  }
}
</script>
