<template>
  <div class="tile">
    <div class="main-bar">
      <div class="name">{{ data.created_by }}</div>
      <div class="download-link">
        <DownloadIcon />
      </div>
    </div>
    <div class="resources">
      <ResourcesIcon class="resources-icon" />
      {{ data.count }} {{ $t('user_view.resources') }}
    </div>
    <div class="spent">
      <DollarIcon class="dollar-icon" />
      ~{{ data.amount_spent }}$ {{ $t('user_view.spent') }}
    </div>
    <div class="tag-percent">
      <StarIcon class="star-icon" />
      <span :class="['bold', getColorByPercent(data.compliance_percentage)]">
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
  },
  methods: {
    getColorByPercent(val: number) {
      if (val < 25) return 'percent_the-lowest'
      if (val < 80) return 'percent_average'
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
  transition: all 0.2s ease-in;
}

.tile:hover {
  cursor: pointer;
  box-shadow: 0px 3px 14px var(--box-shadow-color);
}

.main-bar {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.name {
  color: var(--light-gray);
  font-family: var(--font-family-montserrat);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.download-link {
  transition: opacity 0.1s linear;
}

.download-link:hover {
  cursor: pointer;
  opacity: 0.6;
}
</style>
