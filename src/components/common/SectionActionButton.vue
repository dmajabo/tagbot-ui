<template>
  <div
    :class="`section-action-button section-action-button_${type}`"
  >
    <slot></slot>
    <span>{{ text }}</span>
</div>
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
  height: 38px;
  padding: 0 16px 0 19px;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.section-action-button:hover {
  cursor: pointer;
}

.section-action-button_empty {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  fill: var(--primary-color);
}

.section-action-button_empty:hover {
  background-color: #DEE6FD;
}

.section-action-button_solid {
  background-color: var(--primary-color);
  color: #ffffff;
  fill: #fff;
}

.section-action-button_solid:hover {
  background-color: #DEE6FD;
  fill: var(--primary-color);
  color: var(--primary-color);
}

.section-action-button span {
  display: block;
  font-style: normal;
  padding-left: 11px;
  font-size: 16px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
}

.section-action-button_solid span {
  font-weight: 700;
}
</style>
