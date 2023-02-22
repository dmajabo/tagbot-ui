<template>
  <div>
    <div class="flex-title">
      <h1 class="title-dashboard">Tag Manager</h1>
      <span
          @click.prevent="toggleTagModal()"
          class="add-user-button cloud-button"
          style="cursor: pointer;">
            <img src="/img/plus.svg" alt="">
            <span>{{ $t('common.add_tag') }}</span>
      </span>
    </div>
    <div class="main-dashboard">

      <div class="table-scroll tag-coverage-block">
        <table class="table-dashboard">

          <tbody v-if="!loading">
          <tr class="table-dashboard-t" v-if="tag_standards.length !== 0 && !loading">
            <td colspan="3">{{ $t('common.tag_key') }}</td>
            <td>{{ $t('common.tag_expected_values') }}</td>
          </tr>

          <tr v-for="item in tag_standards">
            <td colspan="3">
              <el-tag
                  class="mx-1"
                  effect="plain"
                  size="large"
                  round
              >
                {{ item.tag_key }}
              </el-tag>
            </td>
            <td>
              <el-tag
                  class="m-4"
                  effect="dark"
                  size="default"
                  round
                  v-for="i in item.tag_values.toString().split(',')"
                  v-if="item.tag_values.length > 0"
              >
                {{ i }}
              </el-tag>
            </td>
            <td>
              <div style="display: flex; flex-direction: row; justify-content: flex-end;">
                <el-button type="info" :icon="editIcon" circle @click.prevent="editTag(item.id)" />
                <el-button type="danger" :icon="deleteIcon" circle @click.prevent="deleteTag(item.id)" />
              </div>
            </td>
          </tr>

          </tbody>
          <tbody v-else>
          <el-skeleton :rows="5" v-if="loading"/>
          </tbody>

        </table>

        <Empty
            v-if="tag_standards.length === 0 && !loading"
            :title="$t('common.no_data')"
            :action="$t('common.add_tag')"
            :call_to_action="toggleTagModal"
        ></Empty>
      </div>

      <div class="t-pagination-block" v-if="!loading && pagination.total !== 0 && pagination.total !== undefined">
        <el-pagination
            v-model:current-page="pagination.current_page"
            :page-size="pagination.per_page"
            :default-page-size="pagination.per_page"
            :small="true"
            :background="true"
            layout="total, prev, pager, next"
            :prev-text="$t('common.previous')"
            :next-text="$t('common.next')"
            :total="pagination.total"
            @current-change="handlePageChange()"
        />
      </div>

    </div>


    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" v-model="tag_modal"
               :title="$t('common.add_tag')" width="30%" center>

      <el-form :model="tag_form" ref="tag_form" label-position="top">
        <el-form-item :label="$t('common.tag_key')">
          <el-input
              v-model="tag_form.tag_key"
              size="large"
          />
        </el-form-item>

        <el-form-item :label="$t('common.tag_has_values')">
          <el-switch v-model="enable_values" size="large"/>
        </el-form-item>

        <div v-if="enable_values">
          <el-space fill :size="20" direction="vertical">
            <el-alert
                :title="$t('common.note')"
                type="success"
                :description="$t('common.tag_values_hint')"
                show-icon
            />

            <el-form-item :label="$t('common.tag_values')">
              <el-select
                  size="large"
                  v-model="tag_form.tag_values"
                  multiple
                  filterable
                  tag-type="success"
                  :reserve-keyword="true"
                  allow-create
                  :multiple-limit="5"
                  :placeholder="$t('common.tag_values_input_help')"
              >
              </el-select>
            </el-form-item>
          </el-space>
        </div>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button @click="tag_modal = false" :disabled="loading">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click.prevent="postTagStandard()" :loading="loading"
                       :disabled="loading">
              <span v-if="tag_form.id === null || tag_form.id === ''">{{ $t('common.add_tag') }}</span>
              <span v-else>{{ $t('common.update_tag') }}</span>
            </el-button>
          </span>
      </template>
    </el-dialog>

    <el-dialog
        :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false"
        v-model="delete_tag_modal"
        :title="$t('common.delete_tag', {tag: tag_form.tag_key})"
        width="30%"
    >
      <span>{{ $t('common.delete_tag_message', {'tag': tag_form.tag_key}) }}</span>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="delete_tag_modal = false" :disabled="loading">{{ $t('common.cancel') }}</el-button>
        <el-button type="danger" @click.prevent="deleteTagPost(tag_form.id)" :loading="loading" :disabled="loading">
              <span>{{ $t('common.delete_confirm') }}</span>
        </el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {userStore} from "../store/userStore"
import Empty from "../components/common/Empty.vue";
import {Delete, Edit} from '@element-plus/icons-vue'
import _ from 'lodash'
import {ElMessage, ElMessageBox} from "element-plus";


export default {
  data() {
    return {
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0
      },
      user: {},
      tag_standards: [],
      tag_modal: false,
      delete_tag_modal: false,
      loading: true,
      tag_form_clean: {
        id: null,
        tag_key: null,
        tag_values: ""
      },
      tag_form: {
        id: null,
        tag_key: null,
        tag_values: []
      },
      enable_values: false
    }
  },
  computed: {
    deleteIcon() {
      return Delete
    },
    editIcon() {
      return Edit
    },
  },
  methods: {
    handlePageChange() {
      this.loadData({})
    },
    toggleTagModal() {
      this.tag_modal = !this.tag_modal
    },
    toggleDeleteTagModal() {
      this.delete_tag_modal = !this.delete_tag_modal
    },
    editTag(item) {
      let data = this.tag_standards.find(x => x.id === item)
      data = _.omit(data, ['created_at','deleted_at', 'deleted_by', 'last_updated_by', 'tenant_id', 'updated_at', 'total'])
      data['tag_values'] = data['tag_values'].split(',')
      this.tag_form = data
      this.toggleTagModal()
    },
    deleteTag(item) {
      let data = this.tag_standards.find(x => x.id === item)
      data = _.omit(data, ['created_at','deleted_at', 'deleted_by', 'last_updated_by', 'tenant_id', 'updated_at', 'total'])
      data['tag_values'] = data['tag_values'].split(',')
      this.tag_form = data
      this.toggleDeleteTagModal()
    },
    deleteTagPost(item) {
      var self = this
      self.loading = true
      const userData = userStore().getData()
      this.$api.post('tenants/' + userData.tenantId + '/analytics/tag-standards/delete', {id: item, user_id: userData.id}).then((response) => {
        self.$toast.success(self.$t('common.delete_success'))
        self.toggleDeleteTagModal()
        self.loadData({})
      }).catch((error) => {
        self.loading = false
        // this.$toast.error(error.response.data)
        console.log(error)
        this.$toast.error("Error deleting tag standard. Please try again...")
      })
    },
    postTagStandard() {
      var self = this
      self.loading = true
      const userData = userStore().getData()
      this.tag_form['user_id'] = userData.id
      this.tag_form['cloud'] = 'aws'
      this.$api.post('tenants/' + userData.tenantId + '/analytics/tag-standards/post', this.tag_form).then((response) => {
        self.$toast.success(self.$t('common.tag_standard_created'))
        self.tag_form = self.tag_form_clean
        self.loadData({})
        self.toggleTagModal()
      }).catch((error) => {
        self.loading = false
        // this.$toast.error(error.response.data)
        console.log(error)
        this.$toast.error("Error adding tag standards. Please try again...")
      })
    },
    loadData(payload) {
      var self = this
      self.loading = true
      payload['page'] = this.pagination.current_page
      payload['per_page'] = this.pagination.per_page
      this.$api.post('tenants/' + this.user.tenantId + '/analytics/tag-standards', payload).then((response) => {
        self.pagination.total = parseInt(response.data.total)
        self.tag_standards = response.data.data
        self.loading = false
      }).catch((error) => {
        // console.log(error)
        self.loading = false
        this.$toast.error(error.message)
      })
    },
  },
  mounted() {
    var self = this
    this.$mitt.on('profile-loaded', () => {
      self.user = userStore().getData()
      self.loadData({})
    })
  },
  created() {
    var self = this
    if (userStore().profile_loaded === true) {
      self.user = userStore().getData()
      self.loadData({})
    }
  },
  components: {
    Empty,
    Delete,
    Edit
  }
}
</script>

<style scoped>
.el-select--large {
  width: 100%;
}
.m-4 {
  margin: 4px;
}
</style>