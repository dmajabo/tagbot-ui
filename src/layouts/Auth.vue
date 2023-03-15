<template>
    <router-view v-slot="{ Component, route}">
      <Transition name="fade-x">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
</template>

<script>
import authService from "../services/auth";

export default {
  data() {
    return {}
  },
  created() {
    console.log("Login initiated..", this.$route.path)
    if (authService.isAuthenticated()) {
      console.log("You're already authenticated.")
      this.$goTo('dashboard')
    } else if (this.$route.path !== '/sign-up' && this.$route.path !== '/login') {
      // this.$goTo('login')
    }
  }
}
</script>
