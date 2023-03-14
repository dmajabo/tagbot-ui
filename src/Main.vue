<template>
  <router-view></router-view>
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
      var self = this
      var u = ustore
      this.$api.get('profile').then((response) => {
        u.setUser(response.data)
        self.$mitt.emit('profile-loaded', {})
        console.log('App ready.')
      }).catch((error) => {
        console.log(error)
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
    console.log("Mounted app..")
  },
  created() {
    console.log(this.$route.path)
    if (!authService.isAuthenticated() &&
      this.$route.path !== '/login' &&
      this.$route.path !== '/sign-up') {
      console.log('Not authenticated..')
      this.$goTo('login')
    } else {
      console.log("Authenticated..")
      this.initialize()
    }
  }
}
</script>

