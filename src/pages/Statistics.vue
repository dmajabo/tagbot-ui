<template>
  <div class="content statistics-content">
    <div class="flex-title"><h1 class="title-dashboard">{{ $t('common.statistics') }}</h1>
      <div><a href="#" class="refresh-text"><img
          src="/img/refresh.svg"
          alt=""><span>{{ $t('common.refresh') }}</span></a></div>
    </div>
    <div class="flex-dashboard">
      <div class="left-dashboard">
        <div class="title-table-dashboard">
          <div v-for="item in nav" :class="item.name + isActive(item)" @click.prevent="$goTo(item.route)">{{ $t('nav.' + item.name) }}</div>
        </div>
        <router-view></router-view>
      </div>
      <div class="right-dashboard">
        <div class="top-10-block" style="display: block;">
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.number_of_accounts') }}</div>
            <div class="info-number">0</div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.resources_count') }}</div>
            <div class="info-number">0</div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.tags_count') }}</div>
            <div class="info-number">0</div>
          </div>
          <div class="frame-connect">
            <div class="info-title">{{ $t('dashboard.tags_standard_percent') }}</div>
            <div class="info-number">72%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav: [
        {name: 'top10', 'route': 'statistics'},
        {name: 'resources', 'route': 'resources'},
        {name: 'coverage', 'route': 'coverage'},
      ],
    }
  },
  methods: {
    isActive(item) {
      if(this.$route.name === item.route) {
        return "title-active active"
      }
      return ""
    }
  }
}
</script>