<template>
  <div class="wrapper-resources">
    <ResourceCard v-for="(item, idx) in resources" :key="idx" :data="item"></ResourceCard>
  </div>
</template>

<script lang="ts">
import ResourceCard from '../common/ResourceCard.vue'

import resources from '../../assets/fakeResourcesData.json'

export default {
  components: {
    ResourceCard
  },
  data() {
    return {
      resources
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
