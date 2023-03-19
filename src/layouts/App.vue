<template>
  <div id="main-container">
    <div class="main-left">
      <div class="left-menu">
        <div class="upper-menu"><a class="logotype" href="#" @click.prevent="$goTo('dashboard')">
          <div class="tag-logo">Tag</div>
          <div class="bot-logo">[Bot]</div>
        </a>
          <nav class="main-navigation">
            <a :class="getNavClass(item.route)" href="#" v-for="item in nav"
               @click.prevent="$goTo(item.route)">{{ $t('nav.' + item.name) }}</a>
          </nav>
        </div>
        <div class="lower-info">
          <div class="settings-title space-left">{{ $t('nav.settings') }}</div>
          <div class="settings-underline"></div>
          <div class="settings-block space-left">
            <a :class="getUserNavClass(item.route)" v-for="item in userNav" href="#" @click.prevent="$goTo(item.route)">{{
                $t('nav.' + item.name)
              }}</a>
          </div>
          <div class="user-block space-left">
            <div class="user-info">
              <div class="user-img-block"><img
                  src="data:image/png;base64,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"
                  class="user-img" alt=""></div>
              <span class="username">{{ user.name }}</span>
              <div class="hover-menu-new">
                <a class="" href="#" @click.prevent="$goTo('account-settings')">{{ $t('nav.account_settings') }}</a>
                <span @click.prevent="logout()">{{ $t('nav.logout') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <main>
      <div class="main-right">
        <div :class="['content-right', this.$route.meta.isSidebar && 'fixed-height']">
          <router-view v-slot="{ Component, route}">
            <!-- <transition mode="out-in" name="fade"> -->
              <component :is="Component" :key="route.path"/>
            <!-- </transition> -->
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useLayoutStore } from '../store/layoutStore'

const layoutStore = useLayoutStore()
</script>

<script>

import authService from '../services/auth'
import { userStore } from '../store/userStore'

export default {
  data() {
    return {
      user: {'name': ''},
      polling: null,
      nav: [
        {name: 'dashboard', 'route': 'dashboard'},
        {name: 'statistics', 'route': 'statistics'},
        {name: 'user_view', 'route': 'user-view'},

        // {name: 'onboard_org', 'route': 'onboard-organization'},
      ],
      userNav: [
        {name: 'settings', 'route': 'settings'},
        {name: 'cloud_accounts', 'route': 'cloud-accounts'},
        {name: 'connections', 'route': 'connections'},
        {name: 'tag_manager', 'route': 'tag-manager'},
      ]
    }
  },
  computed: {},
  methods: {
    getNavClass(route) {
      if (route === this.$route.name) {
        return 'nav-link active'
      }
      return 'nav-link'
    },
    getUserNavClass(route) {
      if (route === this.$route.name) {
        return 'nav-link settings-link active'
      }
      return 'nav-link settings-link'
    },
    logout() {
      authService.logout(userStore())
      this.$goTo('login')
    },
  },
  components: {},
  mounted() {
    var self = this
    this.$mitt.on('profile-loaded', ()=> {
      self.user = userStore().getData()
    })
    console.log(this.layoutStore)
  },
  created() {
    var self = this
    if (this.$route.name === 'root') {
      self.$goTo('dashboard')
    }
  }
}
</script>

<style lang="css">

.hover-menu-new {
  display: none;
  background: #FFF;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #4f4f4f;
  position: absolute;
  right: 0;
  left: 55px;
  width: 110%;
  top: -37px;
  min-width: 184px;
  padding: 10px 8px;
  gap: 4px;
  text-align: left;
}

.user-info:hover .hover-menu, .user-info:hover .hover-menu-new {
  display: block
}

.hover-menu a, .hover-menu-new a {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #4f4f4f;
  display: block;
  padding-top: 5px;
  padding-bottom: 5px;
}

.hover-menu-new * {
  display: inline-block;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  padding: 8px 16px;
  white-space: nowrap;
  border-radius: 6px;
  width: 100%;
  z-index: 10;
}

.fixed-height {
  max-height: 100vh;
  overflow: hidden;
}
</style>

