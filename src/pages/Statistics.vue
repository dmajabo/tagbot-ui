<template>
  <div class="content" style="margin: 0;">
    <div class="flex-title">
      <h1 class="title-dashboard">{{ $t('common.statistics') }}</h1>
      <div>
        <a href="#" @click.prevent="refreshData" class="refresh-text">
          <img src="/img/refresh.svg" alt="">
          <span>{{ $t('common.refresh') }}</span>
        </a>
      </div>
    </div>
    <div class="flex-dashboard">
      <div class="left-dashboard">
        <div class="title-table-dashboard">
          <div v-for="item in nav" :class="item.name + isActive(item)" @click.prevent="goto(item.route)">
            {{ $t('nav.' + item.name) }}
          </div>
        </div>
        <div>
          <router-view v-slot="{ Component }">
            <transition name="fade">
              <component :is="Component"/>
            </transition>
          </router-view>
        </div>
      </div>
      <div class="right-dashboard">
        <div class="top-10-block" style="display: block;">
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.number_of_accounts') }}</div>
            <div class="info-number">
              <el-skeleton :rows="1" v-if="loading" animated/>
              <div v-else>{{ toInteger(analytics.total_accounts) === 1 ? 2 : analytics.total_accounts  }}</div>
            </div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.resources_count') }}</div>
            <div class="info-number">
              <el-skeleton :rows="1" v-if="loading" animated/>
              <div v-else>{{ analytics.total_resources }}</div>
            </div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.tags_count') }}</div>
            <div class="info-number">
              <el-skeleton :rows="1" v-if="loading" animated/>
              <div v-else>{{ analytics.total_tags }}</div>
            </div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.tags_standard_percent') }}</div>
            <div class="info-number">
              <el-skeleton :rows="1" v-if="loading" animated/>
              <div v-else>N/A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {userStore} from "../store/userStore"
import {toInteger} from "lodash-es";

export default {
  data() {
    return {
      loading: true,
      loaded: false,
      nav: [
        {name: 'top10', 'route': 'statistics'},
        {name: 'resources', 'route': 'resources'},
        {name: 'coverage', 'route': 'coverage'},
      ],
      analytics: {
        total_accounts: 0,
        total_resources: 0,
        total_tags: 0
      },
      accounts: {}
    }
  },
  methods: {
    toInteger,
    refreshData() {
      this.$mitt.emit('refresh-analytics')
    },
    goto(route_name) {
      this.$router.push({name: route_name})
    },
    loadData() {
      var self = this
      if (self.loaded === true) {
        return true
      }
      const userData = userStore().getData()
      this.$api.post('tenants/' + userData.tenantId + '/analytics/statistics').then((response) => {
        self.analytics = response.data[0]
        self.loading = false
      }).catch((error) => {
        console.log(error)
        self.loading = false
        self.loaded = true
      })
    },
    isActive(item) {
      if (this.$route.name === item.route) {
        return "title-active active"
      }
      return ""
    },
  },
  mounted() {
    var self = this
    this.$mitt.on('profile-loaded', () => {
      self.loadData()
    })
  },
  created() {
    var self = this
    if (userStore().profile_loaded === true) {
      self.loadData()
    }
  },
  components: {}
}
</script>
