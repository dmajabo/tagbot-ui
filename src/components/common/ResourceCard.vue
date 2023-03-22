<template>
  <div class="tile">
    <div class="main-bar">
      <img v-if="data.image_url" :src="`/AWS_Icon_Svg/${data.image_url}`" alt="" class="resource-logo" />
      <div class="name">{{ data.resource_type }}</div>
      <div class="more">
        <MoreIcon />
      </div>
    </div>
    <div class="resources">
      <ResourcesIcon class="resources-icon" />
      {{ data.count }} {{ $t('user_view.resources') }}
    </div>
    <div class="spent">
      <DollarIcon class="dollar-icon" />
      ~{{ data.amount_spent }}% {{ $t('user_view.spent') }}
    </div>
    <div class="tag-percent">
      <StarIcon class="star-icon" />
      <span :class="['bold', getColorByPercent(data.tagPercent)]">
        {{ data.compliance_percentage }}%
      </span>
      {{ $t('user_view.tag_standard') }}
    </div>
  </div>
</template>

<script lang="ts">
import ResourcesIcon from '../../assets/images/resources.svg'
import DollarIcon from '../../assets/images/dollar.svg'
import StarIcon from '../../assets/images/star.svg'
import DownloadIcon from '../../assets/images/download-icon.svg'
import MoreIcon from '../../assets/images/more.svg'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    ResourcesIcon,
    DollarIcon,
    StarIcon,
    DownloadIcon,
    MoreIcon
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

<style scope>
.tile {
  align-items: flex-start;
  background-color: var(--white);
  border: 1px solid;
  border-color: #f6f7f7;
  border-radius: 4px;
  box-shadow: 0px 3px 14px #0000000d;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.main-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  column-gap: 8px;
}

.name {
  color: var(--light-gray);
  font-family: var(--font-family-montserrat);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
}

.name_with-icon {
  display: flex;
  flex-direction: row;
  column-gap: 8px;
}

.resources,
.spent,
.tag-percent {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  color: var(--light-gray);
  font-family: var(--font-family-montserrat);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  text-align: right;
}

.bold {
  font-weight: 700;
}

.resources-icon {
  width: 14px;
  height: 13px;
  fill: var(--purple);
}

.dollar-icon {
  width: 16px;
  height: 16px;
  fill: var(--purple);
}

.star-icon {
  width: 14px;
  height: 14px;
  fill: var(--purple);
}

.percent_the-lowest {
  color: var(--red);
}

.percent_average {
  color: var(--orange);
}

.percent_the-highest {
  color: var(--green);
}

.exclamation-icon {
  width: 16px;
  height: 16px;
  fill: var(--warning);
}

.more {
  margin-left: auto;
  transition: opacity 0.1s linear;
}

.more:hover {
  cursor: pointer;
  opacity: 0.6;
}

.resource-logo {
  width: 24px;
  height: 24px;
}
</style>
