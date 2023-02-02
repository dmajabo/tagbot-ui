<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <transition>
        <component :is="Component" :key="route.path"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import authService from "./services/auth";
import {userStore} from "./store/userStore";

export default {
  data() {
    return {}
  },
  methods: {
    loadProfile() {
      var self = this
      this.$api.get('profile').then((response) => {
        // console.log(response)
        authService.setUser(this.$pinia, response.data)
        self.$mitt.emit('profile-loaded', {})
      }).catch((error) => {
        // console.log(error)
        self.$toast.error(error.response.data)
      })
    },
    initialize() {
      let userData = userStore().getData()
      if(userData.id === '') {
        this.loadProfile()
      }
    }
  },
  computed: {},
  components: {},
  mounted() {
    // console.log(this.$route)
    console.log("Mounted app..")
  },
  created() {
    if (!authService.isAuthenticated()) {
      console.log('Not authenticated..')
      this.$goTo('login')
    } else {
      console.log("Authenticated..")
      this.initialize()
    }
  }
}
</script>

