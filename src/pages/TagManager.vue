<template>
  <div>
    <div class="title-block">
      <div class="flex-title"><h1 class="title-dashboard">Tag Manager</h1></div>
    </div>
    <div class="main-dashboard">

      <div class="table-scroll tag-coverage-block">
        <table class="table-dashboard">

          <tbody v-if="!loading">
          <tr class="table-dashboard-t" v-if="tag_standards.length !== 0 && !loading">
            <td colspan="3">{{ $t('common.tag_key') }}</td>
            <td>{{ $t('common.tag_cloud')}}</td>
            <td>{{ $t('common.tag_expected_values')}}</td>
            <td>{{ $t('common.tag_service')}}</td>
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
            v-if="tag_standards.length === 0 && !loading"
            :title="$t('common.no_data')"
        ></Empty>
      </div>


    </div>
  </div>
</template>

<script>
import {userStore} from "../store/userStore"
import Empty from "../components/common/Empty.vue";
import {
  Delete,
  Star
} from '@element-plus/icons-vue'

export default {
  data() {
    return {
      tag_standards: [],
      tagStandardModal: false,
      loading: false,
      tag_standard_form: {
        onboardAccountId: null,
      }
    }
  },
  computed: {
    deleteIcon() {
      return Delete
    },
  },
  methods: {
    showTagStandardModal() {
      this.tagStandardModal = !this.tagStandardModal
    },
    createTagStandard() {
      var self = this
      const userData = userStore().getData()
      this.$api.post('users/' + userData.tenantId + '/tag-standards/create', this.tag_standard_form).then((response) => {
        self.$toast.success($t('tag_standard_created'))
      }).catch((error) => {
        this.$toast.error(error.response.data)
      })
    },
    loadData() {

    }
  },
  mounted() {
    var self = this
    this.$mitt.on('profile-loaded', ()=> {
      self.loadData()
    })
  },
  components: {
    Empty,
    Delete,
    Star
  }
}
</script>