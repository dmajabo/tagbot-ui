<template>
  <div class="table-scroll top-10-block" style="display: block;">

      <table class="table-dashboard">
        <tbody v-if="!loading">
          <tr class="table-dashboard-t" v-if="tags.length !== 0 && !loading">
            <td colspan="3">{{ $t('common.tags') }}</td>
            <td>{{ $t('common.used') }}</td>
            <td>{{ $t('common.add_standards') }}</td>
          </tr>

          <tr v-for="item in tags">
            <td colspan="3">
              <div class="flex-key"><a href="#"></a>
                <el-tag
                    class="mx-1"
                    effect="plain"
                    size="large"
                    round
                >
                  {{ item.tag_key }}
                </el-tag>
              </div>
            </td>
            <td>
              <el-tag
                  class="mx-1"
                  effect="plain"
                  size="large"
                  round
              >
                {{ item.tag_usage_percentage }}%
              </el-tag>
            </td>
            <td>
              <div class="flex-key" style="display: block;"><a href="#"><img
                  src="/img/plus-blue.svg" alt=""></a>
              </div>
            </td>
          </tr>

        </tbody>
        <tbody v-if="loading">
        <el-skeleton :rows="5" v-if="loading" animated />
        </tbody>
      </table>

      <Empty
          v-if="tags.length === 0 && !loading"
          :title="$t('common.no_tags')"
          :detail="$t('common.create_tags')"
          button_link="tag-manager"
          :button_text="$t('common.add_tag')"
      ></Empty>

  </div>
</template>

<script>
import Empty from "../common/Empty.vue";
import {userStore} from "../../store/userStore";
export default {
  data() {
    return {
      tags: [],
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
      this.$api.post('tenants/' + userData.tenantId + '/analytics/top-10-tags').then((response) => {
        self.tags = response.data
        self.loading = false
      }).catch((error) => {
        console.log(error)
        self.loading = false
        self.loaded = true
      })
    },
  },
  mounted() {
    var self = this
    this.$mitt.on('refresh-analytics', function () {
      if(self.$route.name === 'top10' || self.$route.name === 'statistics') {
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