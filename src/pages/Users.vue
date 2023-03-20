<template>
  <div>
    <div class="title-block">
      <div class="flex-title"><h1 class="title-dashboard">User view</h1></div>
      <div class="title-buttons">
        <SectionActionButton
          :text="$t('common.refresh')"
          type="empty"
          @click.prevent="refreshData"
        >
          <RefreshIcon />
        </SectionActionButton>
        <SectionActionButton
          :text="$t('common.download_all')"
          type="solid"
          @click.prevent="refreshData"
        >
          <DownloadAllIcon />
        </SectionActionButton>
      </div>
    </div>
    <div class="main-dashboard">
      <div class="dropdown-blocks">
        <div class="flex-dropdown">
          <el-select
            v-model="selectedUser"
            :disabled="users.length === 0"
            size="large"
            filterable
            clearable
            placeholder="Users"
            class="m-2 ml-0"
          >
            <el-option
              v-for="item in users"
              :key="item.email"
              :label="getEmail(item.email)"
              :value="item.email"
            />
          </el-select>

          <el-select
            v-model="selectedAccount"
            :disabled="accounts.length === 0"
            size="large"
            filterable
            clearable
            placeholder="Accounts"
            class="m-2"
          >
            <el-option
              v-for="item in accounts"
              :key="item.accountNumber"
              :label="item.accountNumber"
              :value="item.accountNumber"
            />
          </el-select>
          <el-button
            @click.prevent="queryResources()"
            size="large"
            type="primary"
            :loading="loading"
            class="m-2"
          >
            {{ $t('common.apply') }}
          </el-button>
        </div>
        <div class="sort-dropdown-block">
          <select class="sort-dropdown">
            <option class="dropdown-all-acc">Sort: A - Z</option>
            <option class="dropdown-all-acc">Sort: Z - A</option>
          </select>
        </div>
      </div>

      <div class="main-info">
        <div class="tile-wrapper">
          <el-skeleton v-if="loading" animated>
            <template #template>
              <el-skeleton-item variant="rect" style="width: 100%; height: 149px" />
            </template>
          </el-skeleton>
          <Tile
            v-for="(tile, idx) in usersViewSummary"
            :key="idx"
            :data="tile"
          />
        </div>

        <Empty
          v-if="usersViewSummary.length === 0 && !loading"
          :title="$t('common.no_accounts')"
          :detail="$t('common.start_onboarding')"
          button_link="get-started"
          :button_text="$t('common.get_started')"
        ></Empty>
      </div>

      <div
        class="t-pagination-block"
        v-if="
          !loading && pagination.total !== 0 && pagination.total !== undefined
        "
      >
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
    <router-view></router-view>
    <ResourcesModal></ResourcesModal>
  </div>
</template>

<script>
import { userStore } from '../store/userStore'
import Empty from '../components/common/Empty.vue'
import _ from 'lodash'
import ResourcesModal from '../components/dashboard/ResourcesModal.vue'
import SectionActionButton from '../components/common/SectionActionButton.vue'
import Tile from '../components/common/Tile.vue'

import RefreshIcon from '../assets/images/refresh-icon.svg'
import DownloadAllIcon from '../assets/images/download-icon.svg'

export default {
  data () {
    return {
      user: {},
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0
      },
      userQuery: '',
      accountQuery: '',
      selectedUser: null,
      selectedAccount: null,
      selectedResourceType: null,
      accounts: [],
      users: [],
      resources: [],
      loading: true,
      open: false,
      usersViewSummary: [],
      totalSummaries: 0
    }
  },
  computed: {},
  methods: {
    refreshData () {
      this.loadResources({})
    },
    handlePageChange () {
      this.loadResources({})
    },
    openModal (resource) {
      var self = this
      // console.log("Opening...")
      this.$mitt.emit('open-resource-modal', {
        user: resource.created_by,
        alias: self.getEmail(resource.created_by),
        tenant: resource.tenant_id,
        type: resource.type
      })
    },
    queryResources () {
      this.loadResources({
        accountNumber: this.selectedAccount,
        userName: this.selectedUser
      })
    },
    loadResources (payload) {
      payload['page'] = this.pagination.current_page
      payload['per_page'] = this.pagination.per_page
    },
    loadUserViewSummary (payload) {
      this.loading = true
      const tenantId = import.meta.env.DEV
        ? '3420b906-3ee8-4ed1-8738-ec0ca712d4bb'
        : this.user.tenantId
      this.$api
        .post(`tenants/${tenantId}/analytics/user-view-summary`, payload)
        .then(response => {
          console.log(response)
          this.usersViewSummary = response?.data?.users
          this.totalSummaries = response?.data?.total
          this.loading = false
        })
    },
    loadData () {
      this.user = userStore().getData()
      this.loadUserViewSummary({})
    }
  },
  mounted () {
    var self = this
    this.$mitt.on('profile-loaded', () => {
      self.loadData()
    })
  },
  created () {
    var self = this
    if (userStore().profile_loaded === true) {
      self.loadData()
    }
  },
  components: {
    ResourcesModal,
    Empty,
    SectionActionButton,
    RefreshIcon,
    DownloadAllIcon,
    Tile
  }
}
</script>

<style scoped>
.el-skeleton {
  padding-left: 0;
  padding-right: 0;
}

.tile-wrapper {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, 340px);
  grid-template-rows: auto;
  margin-top: 20px;
  margin-bottom: 200px;
}
</style>
