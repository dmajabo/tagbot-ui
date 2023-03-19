<template>
  <div class="wrapper-one-resource">
    <div class="description-bar">
      <div class="logo-block">
        <FirstIcon class="logo-icon" />
        AWS Compute
      </div>
      <div class="info">
        <div class="resources">
          <ResourcesIcon class="resources-icon" />
          3 {{ $t('user_view.resources') }}
        </div>
        <div class="spent">
          <DollarIcon class="dollar-icon" />
          ~5000$ {{ $t('user_view.spent_per_bucket') }}
        </div>
        <div class="tag-percent">
          <CertificateIcon class="certificate-icon" />
          <span :class="['bold', getColorByPercent(24)]">
            24%
          </span>
          {{ $t('user_view.tag_compliancy') }}
        </div>
        <div class="total-cost">{{ $t('user_view.total_cost') }} - 4232$</div>
      </div>
    </div>
    <div class="content-res">
      <div class="resource-tag">
        <div class="header-bar">
          <div class="name">i-930493</div>
          <div class="extra-info">
            <div class="spent">
              <DollarIcon class="dollar-icon" />
              2.353$
            </div>
            <div class="location">
              <LocationIcon class="location-icon" />
              us-est-1
            </div>
            <div class="user">
              <UserIcon class="user-icon" />
              132
            </div>
          </div>
        </div>
        <div class="header-bar">
          <div class="type">EC2</div>
        </div>
        <div class="resource-line"></div>
        <div class="resource-table">
          <div class="resource-column">
            <div class="resource-table-header">
              {{ $t('user_view.tag_key_tracked') }}
            </div>
            <div>abigos_locos</div>
            <div>abigos_locos</div>
            <div>abigos_locos</div>
          </div>
          <div class="resource-column">
            <div class="resource-table-header">
              {{ $t('user_view.tags_used') }}
            </div>
            <div>abigos_locos</div>
            <div>abigos_locos</div>
            <div>abigos_locos</div>
          </div>
          <div class="resource-column">
            <div class="resource-table-header">
              {{ $t('user_view.compliant') }}
            </div>
            <div class="yes">Yes</div>
            <div class="yes">Yes</div>
            <div class="yes">Yes</div>
          </div>
          <div class="resource-column">
            <div class="resource-table-header">
              {{ $t('user_view.values_tracked') }}
            </div>
            <div>abigos_locos</div>
            <div>abigos_locos</div>
            <div>abigos_locos</div>
          </div>
          <div class="resource-column">
            <div class="resource-table-header">
              {{ $t('user_view.values_used') }}
            </div>
            <div>abigos_locos</div>
            <div>abigos_locos</div>
            <div>abigos_locos</div>
          </div>
          <div class="resource-column">
            <div class="resource-table-header">
              {{ $t('user_view.compliant') }}
            </div>
            <div class="yes">Yes</div>
            <div class="yes">Yes</div>
            <div class="no">No</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FirstIcon from '../../assets/images/1.svg'
import ResourcesIcon from '../../assets/images/resources.svg'
import DollarIcon from '../../assets/images/dollar.svg'
import CertificateIcon from '../../assets/images/certificate.svg'
import LocationIcon from '../../assets/images/location.svg'
import UserIcon from '../../assets/images/user.svg'

export default {
  components: {
    FirstIcon,
    ResourcesIcon,
    DollarIcon,
    CertificateIcon,
    LocationIcon,
    UserIcon
  },
  methods: {
    getColorByPercent (val: number) {
      if (val < 50) return 'percent_the-lowest'
      if (val < 85) return 'percent_average'
      return 'percent_the-highest'
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
  row-gap: 12px;
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
