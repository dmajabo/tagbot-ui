<template>
  <div class="wrapper-resources">
    <ResourceCard v-for="(item, idx) in resources" :key="idx" :data="item"></ResourceCard>
  </div>
</template>

<script lang="ts">
import { userStore } from '../../store/userStore'
import ResourceCard from '../common/ResourceCard.vue'

export default {
  components: {
    ResourceCard
  },
  props: {
    pickedUser: { type: Object, default: () => {} },
  },
  data() {
    return {
      user: {},
      resources: [],
      loading: true,
    }
  },
  mounted() {
    this.user = userStore().getData()
    this.loadData()
  },
  methods: {
    loadResources(payload) {
      this.loading = true
      const tenantId = import.meta.env.DEV
        ? '3420b906-3ee8-4ed1-8738-ec0ca712d4bb'
        : this.user.tenantId
      this.$api
        .post(`tenants/${tenantId}/analytics/resource_view_summary`, payload)
        .then(response => {
          this.resources = response?.data?.resources
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
    pickedUser: function (newVal, oldVal) {
      if (!newVal) {
        this.resources = []
      } else {
        this.loadResources({
          userName: newVal.created_by
        })
      }
    }
  }
}
</script>

<style scoped>
.wrapper-resources {
  display: grid;
  grid-template-columns: repeat(auto-fill, 340px);
  gap: 20px;
}
</style>
