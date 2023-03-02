<template>
  <div class="table-scroll created-resoures-block">
    <table class="table-dashboard">
        <tbody v-if="!loading">
        <tr class="table-dashboard-t" v-if="resources.length !== 0 && !loading">
          <td colspan="3">{{ $t('common.email') }}</td>
          <td>{{ $t('common.count_of_resources') }}</td>
        </tr>

        <tr v-for="item in resources">
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
              {{ item.count }}
            </el-tag>
          </td>
        </tr>

        </tbody>
        <tbody v-else>
        <el-skeleton :rows="5" v-if="loading" />
        </tbody>
    </table>

    <Empty
        v-if="resources.length === 0 && !loading"
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
      loading: true,
      loaded: false,
    }
  },
  methods: {
    loadData() {
      var self = this
      if(self.loaded === true) {
        return true
      }
      const userData = userStore().getData()
      this.$api.post('tenants/' + userData.tenantId + '/analytics/resources-by-users').then((response) => {
        self.resources = response.data
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
      if(self.$route.name === 'resources') {
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