<template>
  <div class="table-scroll tag-coverage-block">
    <table class="table-dashboard">

          <tbody v-if="!loading">
          <tr class="table-dashboard-t" v-if="tags_by_user.length !== 0 && !loading">
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
                {{ getEmail(item.created_by) }}
              </el-tag>
            </td>
            <td>
              <el-tag
                  class="mx-1"
                  effect="plain"
                  size="large"
                  round
              >
                {{ item.compliance_percentage }}%
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
    getEmail(val) {
      // Just for Demo
      if(userStore().getData().name === 'SSO User') {
        if (!['mohamed.zayan2004@gmail.com', 'rifat.shahnewaz@gmail.com', 'sana.abdulmajeed@gmail.com', 'viet.nguyen@tagbot.ai'].includes(val)) {
          return val
        }
        return this.demoUserMap()[val]
      }
      return val
    },
    demoUserMap() {
      return {
        'mohamed.zayan2004@gmail.com': 'liam@tagbot.ai',
        'rifat.shahnewaz@gmail.com': 'james@tagbot.ai',
        'sana.abdulmajeed@gmail.com': 'sarah@tagbot.ai',
        'viet.nguyen@tagbot.ai': 'daniel@tagbot.ai',
        'root': 'root',
      }
    },
  },
  mounted() {
    var self = this
    this.$mitt.on('refresh-analytics', function () {
      if(self.$route.name === 'coverage') {
        self.loadData()
      }
    })
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
  components: {
    Empty
  }
}
</script>