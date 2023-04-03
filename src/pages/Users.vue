<template>
  <div>
    <div>
      <div class="title-block">
        <div class="flex-title">
          <h1 class="title-dashboard">User view</h1>
        </div>
        <div class="title-buttons">
          <div v-if="refreshRequested" class="refreshing-state">
            <div class="refreshing-text">
              {{ $t('common.refresh_accounts') }}
              {{ refreshingCount }}/{{ totalAccounts }}
            </div>
            <div class="refreshing-progressbar-wrapper">
              <div class="refreshing-progressbar" :style="{
                width: `${refreshingCount/(totalAccounts/100)}%`
                }">
              </div>
            </div>
          </div>
          <SectionActionButton
            :text="textOfRefreshButton"
            type="empty"
            :class="nextRefresh ? 'disable-refresh' : ''"
            @click.prevent="refreshHandler"
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
        <div class="filter-bar dropdown-blocks">
          <div class="flex-dropdown">
            <FilterSelect
              v-if="usersViewSummary.length"
              :placeholder="`All users (${usersViewSummary.length})`"
              :initialOptions="usersNames"
              :totalCount="usersViewSummary?.length"
              :showingCount="filteredUsers.length"
              v-model:selectedValues="usersNamesFiltered"
              v-model:include="include"
            />
          </div>
          <div class="tag-compliance-block">
            <el-slider v-model="sortByPercentage" range :max="100" />
          </div>
          <div class="cost-sorting-block">
            <el-select v-model="sortByCost">
              <el-option
                v-for="item in costsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
                v-for="(tile, idx) in filteredUsers"
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
import { userStore } from '@/store/userStore'
import Empty from '@/components/common/Empty.vue'
import { SidebarContentComponents, SortByCost } from '@/types'
import { storeToRefs } from 'pinia'
import ResourcesModal from '@/components/dashboard/ResourcesModal.vue'
import SectionActionButton from '@/components/common/SectionActionButton.vue'
import Tile from '@/components/common/Tile.vue'
import { useLayoutStore } from '@/store/layoutStore'
import partition from 'lodash/partition'
import { format } from 'date-fns'

import RefreshIcon from '@/assets/images/refresh-icon.svg'
import DownloadAllIcon from '@/assets/images/download-icon.svg'
import UserViewResourcesSidebar from '@/components/dashboard/UserViewResourcesSidebar.vue'
import FilterSelect from '@/components/common/FilterSelect.vue'

export default {
  data(): any {
    return {
      user: {
          tenantId: null
      },
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
      usersNamesFiltered: [],
      include: 'includes',
      filteredUsers: [],
      sortByCost: SortByCost.ASC,
      sortByPercentage: [0, 100] as number[],
      costsOptions: [
        {
          value: SortByCost.ASC,
          label: this.$t('user_view.sort_by_cost_asc')
        },
        {
          value: SortByCost.DESC,
          label: this.$t('user_view.sort_by_cost_desc')
        }
      ],
      refreshRequested: false,
      nextRefresh: null,
      refreshingCount: 0,
      totalAccounts: 0,
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
  computed: {
    tenantId() : any {
      return import.meta.env.DEV
        ? '3420b906-3ee8-4ed1-8738-ec0ca712d4bb'
        : this.user.tenantId
    },
    usersNames () : any {
      return this.usersViewSummary.map(i => i.created_by)
    },
    textOfRefreshButton() : any {
      if (!this.refreshRequested) return ''
      if (this.nextRefresh) {
        return format(this.nextRefresh, "kk:mm") + 'h'
      }
      return this.$t('common.refresh')
    }
  },
  methods: {
    refreshData () {
      this.$api.post(`tenants/${this.tenantId}/data-refresh`)
        .then(res => {
          let now = new Date()
          this.nextRefresh = Date.parse(res.data?.next_refresh) - now
          this.refreshingCount = res.data?.refreshed
          this.totalAccounts = res.data?.total_accounts
          this.refreshRequested = true
        })
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
          this.filteredUsers = this.usersViewSummary
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
    async handleClose (val) {
      this.setLoading(true)
      await this.$nextTick()
      if (val === 'back') {
        this.setContentOfSidebar(SidebarContentComponents.AllResourcesInSidebar)
        await this.$nextTick()
        if (!this.sidebarIsWide) {
          this.drawer = false
        }
        await this.$nextTick()
        this.setSmallSidebar()
      } else {
        this.setSmallSidebar()
        this.drawer = false
        this.setContentOfSidebar(SidebarContentComponents.AllResourcesInSidebar)
      }
      this.setLoading(false)
    },
    downloadAll () {
      this.$api
        .post(
          `tenants/${this.tenantId}/analytics/user-resource-summary/download`,
          {}
        )
        .then(res => {
          let blob = new Blob([res.data], { type: 'application/csv' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'user-resource-summary.csv'
          link.click()
        })
    },
    // TODO: remove dublicate code. Use the mixin or vue3 hooks instead
    updateFiltering () {
      // this.usersFiltered =
      let res = []
      // sorting by cost
      if (this.sortByCost === SortByCost.ASC) {
        res = this.usersViewSummary.sort(
          (a, b) => b.amount_spent - a.amount_spent
        )
      } else {
        res = this.usersViewSummary.sort(
          (a, b) => a.amount_spent - b.amount_spent
        )
      }
      // filtering by tag compliance
      res = res.filter(
        (item: Resource) =>
          item.compliance_percentage >= this.sortByPercentage[0] &&
          item.compliance_percentage <= this.sortByPercentage[1]
      )
      res = partition(res, i => {
        return this.usersNamesFiltered.includes(i.created_by)
      })
      if (this.include === 'includes') {
        this.filteredUsers = res[0]
      } else {
        this.filteredUsers = res[1]
      }
    },
    refreshHandler() {
      if (this.nextRefresh) return
      this.refreshData()
    }
  },
  mounted () {
    var self = this
    this.$mitt.on('profile-loaded', () => {
      self.loadData()
    })
    this.refreshData()
  },
  created () {
    var self = this
    if (userStore().profile_loaded === true) {
      self.loadData()
    }
  },
  // TODO: remake it by usign vue3 setup watch
  watch: {
    sortByCost () {
      this.updateFiltering()
    },
    sortByPercentage () {
      this.updateFiltering()
    },
    usersNamesFiltered () {
      this.updateFiltering()
    },
    include () {
      this.updateFiltering()
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
    ElDrawer,
    FilterSelect
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

.filter-bar {
  display: flex;
  justify-content: flex-start;
  column-gap: 24px;
}

.tag-compliance-block {
  width: 194px;
}

.cost-sorting-block {
  max-width: 138px;
}

.disable-refresh {
  border-color: var(--dirty-white);
  fill: var(--dirty-white);
  color: var(--dirty-white);
}

.disable-refresh:hover {
  cursor: default;
  background-color: #fff;
}

.refreshing-state {
  width: 160px;
  display: flex;
  flex-direction: column;
}

.refreshing-text {
  display: flex;
  flex-direction: row;
  width: 100%;
  font-weight: 400;
  font-size: 14px;
  color: var(--light-gray);
}

.refreshing-progressbar-wrapper {
  margin-top: 7px;
  position: relative;
  background: #F2F2F2;
  width: 100%;
  height: 9px;
}

.refreshing-progressbar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--purple);
}
</style>
