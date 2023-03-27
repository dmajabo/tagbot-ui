<template>
  <div>
    <div>
      <div class="title-block">
        <div class="flex-title">
          <h1 class="title-dashboard">User view</h1>
        </div>
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
            @click.prevent="downloadAll"
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
            <template v-if="loading">
              <el-skeleton animated v-for="n in 5" :key="n">
                <template #template>
                  <el-skeleton-item
                    variant="rect"
                    style="width: 100%; height: 149px"
                  />
                </template>
              </el-skeleton>
            </template>
            <template v-else>
              <Tile
                v-for="(tile, idx) in usersViewSummary"
                :key="idx"
                :data="tile"
                @click="openUserResources(tile)"
              />
            </template>
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
    </div>
    <el-drawer
      v-model="drawer"
      direction="rtl"
      :class="sidebarIsWide ? 'wide-sidebar' : ''"
      :before-close="handleClose"
    >
      <UserViewResourcesSidebar
        :user="currentUser"
        @close-sidebar="handleClose('back')"
      >
        <transition name="slide-fade" appear>
          <component :is="currentContent" :pickedUser="currentUser" />
        </transition>
      </UserViewResourcesSidebar>
    </el-drawer>
    <ResourcesModal></ResourcesModal>
  </div>
</template>

<script lang="ts">
import { ElDrawer } from 'element-plus'
import { userStore } from '../store/userStore'
import Empty from '../components/common/Empty.vue'
import { SidebarContentComponents } from '@/types'
import { storeToRefs } from 'pinia'
import ResourcesModal from '../components/dashboard/ResourcesModal.vue'
import SectionActionButton from '../components/common/SectionActionButton.vue'
import Tile from '../components/common/Tile.vue'
import { useLayoutStore } from '../store/layoutStore'

import RefreshIcon from '../assets/images/refresh-icon.svg'
import DownloadAllIcon from '../assets/images/download-icon.svg'
import UserViewResourcesSidebar from '../components/dashboard/UserViewResourcesSidebar.vue'

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
      totalSummaries: 0,
      currentUser: null,
      drawer: false,
      tenantId: import.meta.env.DEV
        ? '3420b906-3ee8-4ed1-8738-ec0ca712d4bb'
        : this.user.tenantId
    }
  },
  setup () {
    const layoutStore = useLayoutStore()
    const { sidebarIsWide, currentContent } = storeToRefs(layoutStore)
    return {
      sidebarIsWide,
      currentContent,
      setSmallSidebar: layoutStore.setSmallSidebar,
      setWideSidebar: layoutStore.setWideSidebar,
      setContentOfSidebar: layoutStore.setContentOfSidebar,
      setLoading: layoutStore.setLoading
    }
  },
  computed: {},
  methods: {
    refreshData () {
      this.loadUserViewSummary({})
    },
    handlePageChange () {
      this.loadResources({})
    },
    loadUserViewSummary (payload) {
      this.loading = true
      this.$api
        .post(`tenants/${this.tenantId}/analytics/user-view-summary`, payload)
        .then(response => {
          this.usersViewSummary = response?.data?.users
          this.totalSummaries = response?.data?.total
          this.loading = false
        })
    },
    loadData () {
      this.user = userStore().getData()
      this.loadUserViewSummary({})
    },
    openUserResources (data) {
      this.currentUser = data
      this.drawer = true
    },
    handleClose (val) {
      this.setLoading(true)
      this.$nextTick(() => {
        if (val === 'back') {
          if (!this.sidebarIsWide) {
            this.drawer = false
          }
          this.setSmallSidebar()
          this.setContentOfSidebar(
            SidebarContentComponents.AllResourcesInSidebar
          )
        } else {
          this.setSmallSidebar()
          this.drawer = false
          this.setContentOfSidebar(
            SidebarContentComponents.AllResourcesInSidebar
          )
        }
        this.setLoading(false)
      })
    },
    downloadAll () {
      this.$api
        .get(`tenants/${this.tenantId}/analytics/user-resource-summary`)
        .then(res => {
          console.log(res)
        })
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
    Tile,
    UserViewResourcesSidebar,
    ElDrawer
  }
}
</script>

<style>
.el-drawer {
  min-width: 748px;
}

.wide-sidebar.el-drawer {
  min-width: min(1200px, 100%);
}

.el-overlay {
  background-color: rgba(3, 37, 81, 0.4) !important;
}
</style>

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
