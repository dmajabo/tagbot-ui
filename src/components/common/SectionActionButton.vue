<template>
  <a
    href="#"
    :class="`section-action-button section-action-button_${type}`"
    @click.prevent="refreshData"
  >
    <slot></slot>
    <span>{{ text }}</span>
  </a>
</template>

<script>
export default {
  name: 'SectionActionButton',
  props: {
    text: {
      type: String,
    },
    type: {
      type: String,
      default: 'empty',
    }
  }
}
</script>

<style>
.section-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  transition: all 0.2s ease;
}

.section-action-button:hover {
  cursor: pointer;
}

.section-action-button_empty {
  height: 33px;
  border: 1px solid #4876EB;
  color: #4876EB;
  fill: #4876EB;
}

.section-action-button_empty:hover {
  background-color: #DEE6FD;
}

.section-action-button_solid {
  background-color: #4876EB;
  color: #ffffff;
  fill: #fff;
}

.section-action-button_solid:hover {
  background-color: #DEE6FD;
  fill: #4876EB;
  color: #4876EB;
}

.section-action-button span {
  display: block;
  font-style: normal;
  padding-left: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
}
</style>
