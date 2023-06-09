<template>
  <div>
    <div class="title-block">
      <div class="flex-title"><h1 class="title-dashboard">Dashboard</h1></div>
      <div class="title-buttons">
        <SectionActionButton
          :text="$t('common.refresh')"
          type="empty"
          @click.prevent="refreshData">
            <RefreshIcon />
        </SectionActionButton>
        <SectionActionButton
          :text="$t('common.download_all')"
          type="solid"
          @click.prevent="refreshData">
            <DownloadAllIcon />
        </SectionActionButton>
      </div>
    </div>
    <div class="main-dashboard">

      <div class="dropdown-blocks">

        <div class="flex-dropdown">
          <el-select v-model="selectedUser" :disabled="users.length === 0" size="large" filterable clearable
                     placeholder="Users" class="m-2 ml-0">
            <el-option
                v-for="item in users"
                :key="item.email"
                :label="getEmail(item.email)"
                :value="item.email"
            />
          </el-select>

          <el-select v-model="selectedAccount" :disabled="accounts.length === 0" size="large" filterable clearable
                     placeholder="Accounts" class="m-2">
            <el-option
                v-for="item in accounts"
                :key="item.accountNumber"
                :label="item.accountNumber"
                :value="item.accountNumber"
            />
          </el-select>
          <el-button @click.prevent="queryResources()" size="large" type="primary" :loading="loading" class="m-2">
            {{ $t('common.apply') }}
          </el-button>
        </div>
        <div class='sort-dropdown-block'>
          <select class="sort-dropdown">
            <option class="dropdown-all-acc">Sort: A - Z</option>
            <option class="dropdown-all-acc">Sort: Z - A</option>
          </select>
        </div>
      </div>

      <el-skeleton :rows="5" v-if="loading" animated/>
      <div v-else class="main-info">
        <div v-if="!loading && Object.keys(resources).length > 0" class="info-block"
             v-for="item in Object.keys(resources)">
          <div class="content-info-block">
            <div class="info-email">{{ getEmail(item) }}</div>
            <div class="info-services">

              <el-tooltip
                  v-for="resource in resources[item]['resources'].slice(0, 8)"
                  class="box-item"
                  effect="light"
                  :content="resource.type.replaceAll('::', ' ')"
                  placement="bottom"
                  :show-arrow="false"
              >
                <div @click.prevent="openModal(resource)"
                     class="service-block modal-toggle tooltip bottom"
                >
                  <img :src="'/AWS_Icon_Svg/' + resource.image_url" alt="" class="service-img">
                  <span>{{ resource.count }}</span>
                </div>
              </el-tooltip>

            </div>
            <a href="#" class="add-more" v-if="resources[item]['resources'].length > 8">and
              {{ resources[item]['resources'].length - 8 }} {{ $t('common.more') }}</a>
          </div>

          <div class="button-info-block">
            <a href="#" class="download-info">
              <img src="/img/icon/download-info.svg" alt="">
            </a>

            <a href="#" class="open-info">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.6485 0.751479C11.1799 0.282849 10.4201 0.282849 9.95147 0.751478L6 4.70295L2.04853 0.751477C1.5799 0.282848 0.820101 0.282848 0.351473 0.751477C-0.117157 1.22011 -0.117157 1.9799 0.351472 2.44853L5.15147 7.24853C5.6201 7.71716 6.3799 7.71716 6.84853 7.24853L11.6485 2.44853C12.1172 1.97991 12.1172 1.22011 11.6485 0.751479Z"/>
              </svg>
            </a>
          </div>

        </div>


        <Empty
            v-if="accounts.length === 0 && !loading"
            :title="$t('common.no_accounts')"
            :detail="$t('common.start_onboarding')"
            button_link="get-started"
            :button_text="$t('common.get_started')"
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
    <ResourcesModal></ResourcesModal>
  </div>
</template>

<script>
import {userStore} from "../store/userStore"
import Empty from "../components/common/Empty.vue";
import _ from 'lodash'
import ResourcesModal from "../components/dashboard/ResourcesModal.vue";
import SectionActionButton from '../components/common/SectionActionButton.vue'

import RefreshIcon from '../assets/images/refresh-icon.svg'
import DownloadAllIcon from '../assets/images/download-icon.svg'

export default {
  data() {
    return {
      user: {},
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0
      },
      userQuery: "",
      accountQuery: "",
      selectedUser: null,
      selectedAccount: null,
      selectedResourceType: null,
      accounts: [],
      users: [],
      resources: [],
      loading: true,
      open: false,
    }
  },
  computed: {},
  methods: {
    refreshData() {
      this.loadResources({})
    },
    handlePageChange() {
      this.loadResources({})
    },
    openModal(resource) {
      var self = this
      // console.log("Opening...")
      this.$mitt.emit('open-resource-modal', {
        user: resource.created_by,
        alias: self.getEmail(resource.created_by),
        tenant: resource.tenant_id,
        type: resource.type
      })
    },
    queryResources() {
      this.loadResources({accountNumber: this.selectedAccount, userName: this.selectedUser})
    },
    loadUsers() {
      var self = this
      self.loading = true
      this.$api.get('tenants/' + this.user.tenantId + '/resource-users').then((response) => {
        self.users = response.data
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },
    getEmail(val) {
      // Just for Demo
      if(this.user.name === 'SSO User') {
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
    loadAccounts() {
      var self = this
      this.$api.get('users/' + this.user.id + '/accounts').then((response) => {
        self.$mitt.emit('accounts-loaded', {})
        self.accounts = response.data
      }).catch((error) => {
        console.log(error)
      })
    },
    loadResources(payload) {
      var self = this
      self.loading = true
      payload['page'] = this.pagination.current_page
      payload['per_page'] = this.pagination.per_page
      this.$api.post('tenants/' + this.user.tenantId + '/analytics/resources-per-user', payload).then((response) => {
        // console.log(response)
        self.pagination.total = parseInt(response.data.total)
        let res = response.data
        delete res['total']
        self.resources = res
        self.loading = false
      }).catch((error) => {
        this.$toast.error(error.message)
      })
    },
    loadData() {
      this.user = userStore().getData()
      this.loadUsers()
      this.loadAccounts()
      this.loadResources({})
    }
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
  components: {
    ResourcesModal,
    Empty,
    RefreshIcon,
    DownloadAllIcon,
    SectionActionButton
  }
}
</script>

<style scoped>
.el-skeleton {
  padding-left: 0;
  padding-right: 0;
}
</style>


