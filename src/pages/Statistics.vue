<template>
  <div class="content" style="margin: 0px;">
    <div class="flex-title">
      <h1 class="title-dashboard">{{ $t('common.statistics') }}</h1>
      <div>
        <a href="#" class="refresh-text">
        <img src="/img/refresh.svg" alt=""><span>{{ $t('common.refresh') }}</span>
        </a>
      </div>
    </div>
    <div class="flex-dashboard">
      <div class="left-dashboard">
        <div class="title-table-dashboard">
          <div v-for="item in nav" :class="item.name + isActive(item)" @click.prevent="goto(item.route)">{{ $t('nav.' + item.name) }}</div>
        </div>
        <div>
          <router-view v-slot="{ Component, route}">
            <Transition name="fade-x">
              <component :is="Component" :key="route.path" :data="analytics" :loading="loading" />
            </transition>
          </router-view>
        </div>
      </div>
      <div class="right-dashboard">
        <div class="top-10-block" style="display: block;">
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.number_of_accounts') }}</div>
            <div class="info-number">
              <div v-if="!loading">{{accounts.length}}</div>
            </div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.resources_count') }}</div>
            <div class="info-number">
              <div v-if="!loading">{{analytics.totalResources}}</div>
            </div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.tags_count') }}</div>
            <div class="info-number">
              <div v-if="!loading">{{analytics.totalTags}}</div>
            </div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.tags_standard_percent') }}</div>
            <div class="info-number">
              <div v-if="!loading">N/A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {userStore} from "../store/userStore";
import {
  BulletListLoader,
} from 'vue-content-loader'

export default {
  data() {
    return {
      polling: null,
      loading: true,
      loaded: false,
      nav: [
        {name: 'top10', 'route': 'statistics'},
        {name: 'resources', 'route': 'resources'},
        {name: 'coverage', 'route': 'coverage'},
      ],
      analytics: {
        resourcesByUser: [],
        tags: [],
        tagsByUser: [],
        totalResources: 0,
        totalTags: 0
      },
      accounts: {}
    }
  },
  methods: {
    goto(route_name) {
      this.$router.push({name: route_name})
    },
    loadStatistics() {
      var self = this
      if(self.loaded === true) {
        return true
      }
      const userData = userStore().getData()
      this.$api.post('tenants/' + userData.tenantId + '/analytics/statistics').then((response) => {
        self.analytics = response.data
        self.loading = false
      }).catch((error) => {
        console.log(error)
        self.loading = false
        self.loaded = true
      })
    },
    isActive(item) {
      if(this.$route.name === item.route) {
        return "title-active active"
      }
      return ""
    },
    stopPolling() {
      clearInterval(this.polling)
    },
    pollProfileReady () {
      const userData = userStore()
      var self = this
      this.polling = setInterval(() => {
        if(userData.profile_loaded===true && userData.accounts_loaded===true){
          self.stopPolling()
          console.log("Profile ready.")
          let u = userStore()
          self.accounts = u.getAccounts()
          this.loadStatistics()
        }
      }, 3000)
    },
  },
  mounted() {
    this.pollProfileReady()
  },
  components: {
    BulletListLoader
  }
}
</script>

<style lang="css">
  .left-dashboard {
    width: 70% !important;
  }
  .right-dashboard {
    width: 28% !important;
  }
</style>