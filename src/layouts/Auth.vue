<template>
  <div>
    <router-view v-slot="{ Component, route}">
      <Transition name="fade-x">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
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
