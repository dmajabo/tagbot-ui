<template>
  <div class="wrapper">
    <div class="overlay"></div>
    <div class="sidebar">
      <div class="go-back-section" @click="$emit('close-sidebar')">
        <GoBackIcon class="go-back-icon" />
        {{ $t('user_view.go_back_text') }}
      </div>
      <div class="main-details">
        <div v-if="user" class="details">
          <div class="email">{{ user.created_by }}</div>
          <div v-if="!layoutStore.sidebarIsWide" class="details-row">
            <div class="resources">
              <ResourcesIcon class="resources-icon" />
              {{ user.count }} {{ $t('user_view.resources') }}
            </div>
            <div class="spent">
              <DollarIcon class="dollar-icon" />
              ~{{ user.amount_spent }}% {{ $t('user_view.spent') }}
            </div>
            <div class="tag-percent">
              <StarIcon class="star-icon" />
              <span :class="['bold', getColourByPercent(user.compliance_percentage)]">
                {{ user.compliance_percentage }}%
              </span>
              {{ $t('user_view.tag_standard') }}
            </div>
          </div>
        </div>
        <SectionActionButton
          :text="$t('common.download_all')"
          type="solid"
          @click.prevent="$emit('refresh')"
        >
          <DownloadAllIcon />
        </SectionActionButton>
      </div>
      <div class="line"></div>
      <div class="resources-label">{{ $t('user_view.resources_label') }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { useLayoutStore } from '@/store/layoutStore'
import useColoursByPercentage from '@/hooks/useColoursByPercentage'

import GoBackIcon from '@/assets/images/go-back.svg'
import SectionActionButton from '@/components/common/SectionActionButton.vue'
import DownloadAllIcon from '@/assets/images/download-icon.svg'
import ResourcesIcon from '@/assets/images/resources.svg'
import DollarIcon from '@/assets/images/dollar.svg'
import StarIcon from '@/assets/images/star.svg'

export default {
  components: {
    GoBackIcon,
    SectionActionButton,
    DownloadAllIcon,
    ResourcesIcon,
    DollarIcon,
    StarIcon,
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup() {
    const layoutStore = useLayoutStore()
    return {
      layoutStore,
      getColourByPercent: useColoursByPercentage().getColourByPercent
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
  z-index: 4;
}

.overlay {
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
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  z-index: 4;
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

.go-back-section:hover {
  cursor: pointer;
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
  flex-shrink: 0;
  width: 100%;
  height: 1px;
  background-color: var(--dirty-white);
}

.resources-label {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
  text-transform: uppercase;
  color: var(--light-gray);
}
</style>
