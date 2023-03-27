<template>
  <div class="wrapper-all-resources">
    <div class="filter-bar">
      <!-- <div class="resource-filtering-block">
        <el-select v-model="selectedResourceType">
          <el-option
            v-for="item in resourceTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div> -->
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
    <div class="wrapper-resources">
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
      <template v-else-if="layoutStore.loading">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item
              variant="rect"
              style="width: 100%; height: 250px"
            />
          </template>
        </el-skeleton>
      </template>
      <template v-else-if="!layoutStore.sidebarIsWide">
        <ResourceCard
          v-for="(item, idx) in filteredResources"
          :key="idx"
          :dataOfUser="pickedUser"
          :data="item"
        ></ResourceCard>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { userStore } from '@/store/userStore'
import { useLayoutStore } from '@/store/layoutStore'
import { Resource, SortByCost } from '@/types'
import ResourceCard from '@/components/common/ResourceCard.vue'

export default {
  components: {
    ResourceCard
  },
  props: {
    pickedUser: { type: Object, default: () => {} }
  },
  data () {
    return {
      user: {},
      resources: [] as Resource[],
      loading: true,
      sortByCost: SortByCost.ASC,
      sortByPercentage: [0, 100] as number[],
      filteredResources: [] as Resource[],
      costsOptions: [
        {
          value: SortByCost.ASC,
          label: this.$t('user_view.sort_by_cost_asc')
        },
        {
          value: SortByCost.DESC,
          label: this.$t('user_view.sort_by_cost_desc')
        }
      ]
    }
  },
  setup() {
    const layoutStore = useLayoutStore()
    return {
      layoutStore
    }
  },
  mounted () {
    this.user = userStore().getData()
    this.loadData()
  },
  methods: {
    loadResources (payload: { userName: any }) {
      this.loading = true
      const tenantId = import.meta.env.DEV
        ? '3420b906-3ee8-4ed1-8738-ec0ca712d4bb'
        : this.user.tenantId
      this.$api
        .post(`tenants/${tenantId}/analytics/resource_view_summary`, payload)
        .then((response: { data: { resources: Resource[] } }) => {
          this.resources = response?.data?.resources
          this.filteredResources = this.resources
          this.loading = false
        })
    },
    loadData () {
      this.loadResources({
        userName: this.pickedUser.created_by
      })
    }
  },
  watch: {
    pickedUser: function (newVal: Resource) {
      if (!newVal) {
        this.resources = []
      } else {
        this.loadResources({
          userName: newVal.created_by
        })
      }
    },
    sortByCost: function (newVal: SortByCost) {
      if (newVal === SortByCost.ASC) {
        this.filteredResources = this.filteredResources.sort(
          (a: Resource, b: Resource) => b.amount_spent - a.amount_spent
        )
      } else {
        this.filteredResources = this.filteredResources.sort(
          (a: Resource, b: Resource) => a.amount_spent - b.amount_spent
        )
      }
    },
    sortByPercentage: function (newVal: number[]) {
      this.filteredResources = this.resources.filter(
        (item: Resource) =>
          item.compliance_percentage >= newVal[0] &&
          item.compliance_percentage <= newVal[1]
      )
    }
  }
}
</script>

<style scoped>
.wrapper-all-resources {
  display: flex;
  flex-direction: column;
  row-gap: 18px;
}

.filter-bar {
  display: flex;
  justify-content: flex-start;
  column-gap: 24px;
}

.resource-filtering-block {
  width: 320px;
}

.tag-compliance-block {
  width: 194px;
}

.cost-sorting-block {
  max-width: 138px;
}
.wrapper-resources {
  display: grid;
  grid-template-columns: repeat(auto-fill, 340px);
  gap: 20px;
}
</style>
