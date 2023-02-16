<template>
  <div class="table-scroll tag-coverage-block">
    <table class="table-dashboard">

          <tbody v-if="!loading">
          <tr class="table-dashboard-t" v-if="tags_by_user.length === 0 && !loading">
            <td colspan="3">{{ $t('common.email') }}</td>
            <td>{{ $t('common.coverage_of_resources')}}</td>
          </tr>

          <tr v-for="item in tags_by_user">
            <td colspan="3">
              <el-tag
                  class="mx-1"
                  effect="plain"
                  size="large"
                  round
              >
                {{ item.created_by }}
              </el-tag>
            </td>
            <td>
              <el-tag
                  class="mx-1"
                  effect="plain"
                  size="large"
                  round
              >
                {{ item.count }}%
              </el-tag>
            </td>
          </tr>

          </tbody>
          <tbody v-else>
          <el-skeleton :rows="5" v-if="loading" />
          </tbody>

    </table>

    <Empty
        v-if="tags_by_user.length === 0 && !loading"
        :title="$t('common.no_data')"
    ></Empty>
  </div>
</template>

<script>
import Empty from "../common/Empty.vue";
import {userStore} from "../../store/userStore";
export default {
  data() {
    return {
      resources: [],
      polling: null,
      loading: true,
      loaded: false,
      tags_by_user: []
    }
  },
  methods: {
    loadData() {
      var self = this
      if(self.loaded === true) {
        return true
      }
      const userData = userStore().getData()
      this.$api.post('tenants/' + userData.tenantId + '/analytics/tag-coverage-by-users').then((response) => {
        self.tags_by_user = response.data
        self.loading = false
      }).catch((error) => {
        console.log(error)
        self.loading = false
        self.loaded = true
      })
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
          this.loadData()
        }
      }, 3000)
    },
  },
  mounted() {
    var self = this
    this.pollProfileReady()
    this.$mitt.on('refresh-analytics', function () {
      if(self.$route.name === 'coverage') {
        self.loadData()
      }
    })
  },
  components: {
    Empty
  }
}
</script>