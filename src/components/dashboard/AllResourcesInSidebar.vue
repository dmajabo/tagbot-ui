<template>
  <div class="wrapper-all-resources">
    <div class="filter-bar">
      <div class="resource-filtering-block">
        <FilterSelect
          v-if="resourcesNames.length"
          :placeholder="`All resources (${resources?.length})`"
          input-placeholder="Search Resources"
          :initialOptions="resourcesNames"
          :totalCount="resources?.length"
          :showingCount="filteredResources.length"
          v-model:selectedValues="resourcesNamesFiltered"
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
import partition from 'lodash/partition'
import { userStore } from '@/store/userStore'
import { useLayoutStore } from '@/store/layoutStore'
import { Resource, SortByCost } from '@/types'
import ResourceCard from '@/components/common/ResourceCard.vue'
import FilterSelect from '@/components/common/FilterSelect.vue'

export default {
  components: {
    ResourceCard,
    FilterSelect
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
      ],
      resourcesNamesFiltered: [],
      include: 'includes'
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
  computed: {
    resourcesNames() {
      const resourcesWithoutDublicates = [...new Set(this.resources)]
      return resourcesWithoutDublicates.map(i => i.resource_type?.replace(/::/g, ' '))
    }
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
    },
    updateFiltering() {
      let res = []
      // sorting by cost
      if (this.sortByCost === SortByCost.ASC) {
        res = this.resources.sort(
          (a: Resource, b: Resource) => b.amount_spent - a.amount_spent
        )
      } else {
        res = this.resources.sort(
          (a: Resource, b: Resource) => a.amount_spent - b.amount_spent
        )
      }
      // filtering by tag compliance
      res = res.filter(
        (item: Resource) =>
          item.compliance_percentage >= this.sortByPercentage[0] &&
          item.compliance_percentage <= this.sortByPercentage[1]
      )
      res = partition(res, (i) => {
        return this.resourcesNamesFiltered.includes(i.resource_type.replace(/::/g, ' '))
      })
      if (this.include === 'includes') {
        this.filteredResources = res[0]
      } else {
        this.filteredResources = res[1]
      }
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
    sortByCost() {
      this.updateFiltering()
    },
    sortByPercentage() {
      this.updateFiltering()
    },
    resourcesNamesFiltered() {
      this.updateFiltering()
    },
    include() {
      this.updateFiltering()
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

.resource-filtering-block .el-select {
  width: 100%;
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
