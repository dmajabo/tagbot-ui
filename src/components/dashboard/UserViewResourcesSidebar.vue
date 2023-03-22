<template>
  <div class="wrapper">
    <div class="overlay"></div>
    <div :class="['sidebar', $route.meta.isBig && 'sidebar_big']">
      <div v-if="isWide" class="go-back-section">
        <GoBackIcon class="go-back-icon" />
        {{ $t('user_view.go_back_text') }}
      </div>
      <div class="main-details">
        <div v-if="user" class="details">
          <div class="email">{{ user.created_by }}</div>
          <div class="details-row">
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
              <span :class="['bold', getColorByPercent(user.tagPercent)]">
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
import GoBackIcon from '../../assets/images/go-back.svg'
import SectionActionButton from '../common/SectionActionButton.vue'
import DownloadAllIcon from '../../assets/images/download-icon.svg'
import ResourcesIcon from '../../assets/images/resources.svg'
import DollarIcon from '../../assets/images/dollar.svg'
import StarIcon from '../../assets/images/star.svg'

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
    },
    isWide: {
      type: Boolean,
      default: false
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

<style>
.el-drawer {
  min-width: 748px;
}

.el-overlay {
  background-color: rgba(3, 37, 81, 0.4)!important;
}
</style>

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
  width: 748px;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  z-index: 4;
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
