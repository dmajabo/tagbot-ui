<template>
  <router-view v-slot="{ Component, route }">
    <transition mode="out-in">
      <component :is="Component" :key="route.path"/>
    </transition>
  </router-view>
</template>

<script>
import authService from "./services/auth";
import {userStore} from "./store/userStore";

export default {
  data() {
    return {}
  },
  methods: {
    loadProfile(ustore) {
      console.log("Loading profile..")
      var self = this
      var u = ustore
      this.$api.get('profile').then((response) => {
        // console.log(response.data)
        u.setUser(response.data)
        self.loadAccounts(ustore)
        self.$mitt.emit('profile-loaded', {})
      }).catch((error) => {
        // console.log(error)
      })
    },
    loadAccounts(ustore) {
      var u = ustore
      console.log("Loading accounts now...")
      this.$api.get('users/' + ustore.getData().id + '/accounts').then((response) => {
        u.setAccounts(response.data)
        self.$mitt.emit('accounts-loaded', {})
      }).catch((error) => {
      })
    },
    initialize() {
      let ustore = userStore()
      let userData = ustore.getData()
      if(userData.id === '') {
        this.loadProfile(ustore)
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

