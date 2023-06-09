<template>
  <div class="wrapper-one-resource">
    <template v-if="loading">
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="rect" style="width: 100%; height: 250px" />
        </template>
      </el-skeleton>
    </template>
    <template v-else>
      <div class="description-bar">
        <div class="logo-block">
          <img
            v-if="parentResource.image_url"
            :src="`/AWS_Icon_Svg/${parentResource.image_url}`"
            alt=""
            class="logo-icon"
          />
          {{ parentResource.resource_type?.replace(/::/g, ' ') }}
        </div>
        <div class="info">
          <div class="resources">
            <ResourcesIcon class="resources-icon" />
            {{ parentResource.count }} {{ $t('user_view.resources') }}
          </div>
          <div class="spent">
            <DollarIcon class="dollar-icon" />
            ~{{ parentResource.amount_spent }}$
            {{ $t('user_view.spent_per_bucket') }}
          </div>
          <div class="tag-percent">
            <CertificateIcon class="certificate-icon" />
            <span :class="['bold', getColourByPercent(parentResource.compliance_percentage)]">
              {{ parentResource.compliance_percentage }}%
            </span>
            {{ $t('user_view.tag_compliancy') }}
          </div>
        </div>
      </div>
      <div v-for="(res, idx) in openedResource" :key="idx" class="content-res">
        <div class="resource-tag">
          <div class="header-bar">
            <div class="name">{{ res.name }}</div>
            <div class="extra-info">
              <div class="spent">
                <DollarIcon class="dollar-icon" />
                {{ res.cost }} $
              </div>
              <div class="location">
                <LocationIcon class="location-icon" />
                {{ res.region }}
              </div>
              <div class="user">
                <CertificateIcon class="certificate-icon" />
                {{ res.tag_compliance }}
              </div>
            </div>
          </div>
          <div class="header-bar">
            <div class="type">
              {{
                openedResource[0]?.items[0]?.resource_type.match(/::(.*)::/)[1]
              }}
            </div>
          </div>
          <div class="resource-line"></div>
          <div class="resource-table">
            <div class="resource-column">
              <div class="resource-table-header">
                {{ $t('user_view.tag_key_tracked') }}
              </div>
              <div v-for="(item, idx) in res.items" :key="idx">
                {{ item.tag_key }}
              </div>
            </div>
            <div class="resource-column">
              <div class="resource-table-header">
                {{ $t('user_view.tags_used') }}
              </div>
              <div v-for="(item, idx) in res.items" :key="idx">
                {{ item.tag_key_used }}
              </div>
            </div>
            <div class="resource-column">
              <div class="resource-table-header">
                {{ $t('user_view.compliant') }}
              </div>
              <div
                v-for="(item, idx) in res.items"
                :key="idx"
                :class="
                  getYesNoWord(item.tag_key_compliant).toLocaleLowerCase()
                "
              >
                {{ this.getYesNoWord(item.tag_key_compliant) }}
              </div>
            </div>
            <div class="resource-column">
              <div class="resource-table-header">
                {{ $t('user_view.values_tracked') }}
              </div>
              <div v-for="(item, idx) in res.items" :key="idx">
                {{ item.tag_values }}
              </div>
            </div>
            <div class="resource-column">
              <div class="resource-table-header">
                {{ $t('user_view.values_used') }}
              </div>
              <div v-for="(item, idx) in res.items" :key="idx">
                {{ item.tag_value_used }}
              </div>
            </div>
            <div class="resource-column">
              <div class="resource-table-header">
                {{ $t('user_view.compliant') }}
              </div>
              <div
                v-for="(item, idx) in res.items"
                :key="idx"
                :class="
                  getYesNoWord(item.tag_value_compliant).toLocaleLowerCase()
                "
              >
                {{ this.getYesNoWord(item.tag_value_compliant) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { useLayoutStore } from '@/store/layoutStore'
import useColoursByPercentage from '@/hooks/useColoursByPercentage'

import ResourcesIcon from '@/assets/images/resources.svg'
import DollarIcon from '@/assets/images/dollar.svg'
import CertificateIcon from '@/assets/images/certificate.svg'
import LocationIcon from '@/assets/images/location.svg'
import UserIcon from '@/assets/images/user.svg'

export default {
  components: {
    ResourcesIcon,
    DollarIcon,
    CertificateIcon,
    LocationIcon,
    UserIcon
  },
  setup () {
    const layoutStore = useLayoutStore()
    return {
      openedResource: layoutStore.openedResource,
      loading: layoutStore.loading,
      parentResource: layoutStore.parentResource,
      getColourByPercent: useColoursByPercentage().getColourByPercent
    }
  },
  methods: {
    getYesNoWord (val: string) {
      return val === 'TRUE' ? 'Yes' : val === 'FALSE' ? 'No' : val
    }
  }
}
</script>

<style scoped>
.wrapper-one-resource {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.description-bar {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

.logo-block {
  display: flex;
  align-items: center;
  column-gap: 8px;
}

.logo-icon {
  width: 24px;
  height: 24px;
}

.info {
  display: flex;
  flex-direction: row;
  column-gap: 24px;
  justify-content: space-between;
}

.certificate-icon {
  width: 14px;
  height: 13px;
  fill: var(--primary-color);
}

.location-icon {
  width: 12px;
  height: 14px;
  fill: var(--primary-color);
}

.spent,
.resources,
.tag-percent,
.location,
.user,
.total-cost {
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
  flex-shrink: 0;
}

.resource-tag {
  align-items: flex-start;
  border: 1px solid;
  border-color: #f7f7f8;
  border-radius: 4px;
  box-shadow: 0px 10px 26px #0000000d;
  display: flex;
  flex-direction: column;
  padding: 24px;
  width: 100%;
}

.header-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 4px;
}

.name {
  width: auto;
  font-size: 24px;
  font-weight: 400;
  line-height: 29px;
  letter-spacing: 0em;
  color: var(--light-gray);
}

.type {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
  color: var(--light-gray);
}

.extra-info {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  column-gap: 25px;
}

.user-icon {
  width: 14px;
  height: 15px;
  fill: var(--primary-color);
}

.resource-line {
  width: 100%;
  height: 1px;
  background-color: var(--dirty-white);
  margin: 16px 0;
}

.resource-table {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  width: 100%;
}

.resource-table-header {
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  text-align: left;
  color: var(--light-gray);
}

.resource-column {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}

.resource-column > div {
  display: flex;
  align-items: center;
  height: 24px;
  vertical-align: middle;
}

.resource-column > div:nth-child(even) {
  background-color: #f6f6f6;
}

.resource-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
  color: var(--light-gray);
}

.yes {
  color: var(--green);
}

.no {
  color: var(--red);
}
</style>
