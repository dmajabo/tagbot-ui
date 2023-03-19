<template>
  <div class="wrapper">
    <div :class="['sidebar', $route.meta.isBig && 'sidebar_big']">
      <router-link to="/user-view" class="go-back-section">
        <GoBackIcon class="go-back-icon" />
        {{ $t('user_view.go_back_text') }}
      </router-link>
      <div class="main-details">
        <div v-if="currentUser" class="details">
          <div class="email">{{ currentUser.name }}</div>
          <div class="details-row">
            <div class="resources">
              <ResourcesIcon class="resources-icon" />
              {{ currentUser.resources }} {{ $t('user_view.resources') }}
            </div>
            <div class="spent">
              <DollarIcon class="dollar-icon" />
              ~{{ currentUser.spent }}% {{ $t('user_view.spent') }}
            </div>
            <div class="tag-percent">
              <StarIcon class="star-icon" />
              <span :class="['bold', getColorByPercent(currentUser.tagPercent)]">
                {{ currentUser.tagPercent }}%
              </span>
              {{ $t('user_view.tag_standard') }}
            </div>
          </div>
        </div>
        <SectionActionButton
          :text="$t('common.download_all')"
          type="solid"
          @click.prevent="refreshData"
        >
          <DownloadAllIcon />
        </SectionActionButton>
      </div>
      <div class="line"></div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import GoBackIcon from '../../assets/images/go-back.svg'
import SectionActionButton from '../common/SectionActionButton.vue'
import DownloadAllIcon from '../../assets/images/download-icon.svg'
import ResourcesIcon from '../../assets/images/resources.svg'
import DollarIcon from '../../assets/images/dollar.svg'
import StarIcon from '../../assets/images/star.svg'

import fakeData from '../../assets/fakeData.json'

export default {
  components: {
    GoBackIcon,
    SectionActionButton,
    DownloadAllIcon,
    ResourcesIcon,
    DollarIcon,
    StarIcon,
  },
  data() {
    return {
      fakeData
    }
  },
  computed: {
    currentUser() {
      return fakeData.find(i => i.id === Number(this.$route.params.id))
    }
  },
  methods: {
    getColorByPercent(val: number) {
      if (val < 50) return 'percent_the-lowest'
      if (val < 85) return 'percent_average'
      return 'percent_the-highest'
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(3, 37, 81, 0.4);
  z-index: 3;
}

.sidebar {
  background: var(--white);
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  width: 748px;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
}

.sidebar_big {
  width: max(850px, 100%);
}

.go-back-section {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: var(--light-gray);
}

.go-back-icon {
  width: 8px;
  height: 12px;
  fill: var(--primary-color);
}

.main-details {
  display: grid;
  grid-template-columns: 2fr 1fr;
}

.details {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: var(--light-gray);
}

.details-row {
  display: flex;
  flex-direction: row;
  column-gap: 8px;
}

.line {
  width: 100%;
  height: 1px;
  background-color: var(--dirty-white);
}
</style>
