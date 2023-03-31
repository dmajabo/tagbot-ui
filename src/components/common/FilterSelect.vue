<template>
  <div class="el-select wrapper-filter-select" ref="target">
    <div
      @click="toggle"
      class="select-trigger el-tooltip__trigger el-tooltip__trigger"
    >
      <div :class="`el-input el-input--suffix ${active && 'is-focus'}`">
        <div class="el-input__wrapper">
          <input
            class="el-input__inner"
            type="text"
            readonly=""
            autocomplete="off"
            tabindex="0"
            :placeholder="placeholder"
          />
          <span class="el-input__suffix">
            <span class="el-input__suffix-inner">
              <i :class="`el-icon el-select__caret el-select__icon ${active && 'is-reverse'}`">
                <CavetIcon />
              </i>
            </span>
          </span>
        </div>
      </div>
    </div>
    <div v-if="active" class="content">
      <el-radio-group
        :model-value="include"
        @change="$emit('update:include', $event)"
        class="type-of-including-group">
        <el-radio label="includes" size="large">{{ $t('filter_select.include') }}</el-radio>
        <el-radio label="excludes" size="large">{{ $t('filter_select.exclude') }}</el-radio>
      </el-radio-group>
      <div class="input-wrapper">
        <el-input v-model="input" :placeholder="inputPlaceholder" />
      </div>
      <div class="checkbox-group">
        <el-checkbox
          v-if="showedOptions.length"
          :model-value="selectAll"
          @change="selectHandler"
          :label="$t('filter_select.select_all')" />
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            class="one-line-text"
            v-for="(item, idx) in options"
            :key="idx"
            :label="item.label"
            v-show="item.show"
          />
        </el-checkbox-group>
      </div>
      <div class="showing-wrapper">
        Showing {{ showingCount }} of {{ totalCount }} results
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

import CavetIcon from '@/assets/images/cavet.svg'

export default {
  components: {
    CavetIcon
  },
  props: {
    placeholder: String,
    inputPlaceholder: String,
    initialOptions: Array,
    totalCount: Number,
    showingCount: Number,
    selectedValues: Array,
    include: String,
  },
  emits: ['update:selectedValues', 'update:include'],
  setup() {
    const target = ref(null)
    const active = ref(false)

    onClickOutside(target, (event) => {
      active.value = false
    })

    return { target, active }
  },
  data () {
    return {
      input: '',
      selectAll: true,
      checkList: [...this.initialOptions],
      options: this.initialOptions.map(i => ({ label: i, show: true })),
    }
  },
  computed: {
    showedOptions() {
      return this.options.filter(i => i.show)
    }
  },
  watch: {
    input (newVal) {
      this.options.forEach(i => {
        if (i.label.toUpperCase().match(newVal.toUpperCase())) {
          i.show = true
        } else {
          i.show = false
        }
      })
    },
    checkList() {
      this.$emit('update:selectedValues', this.checkList)
      if (this.showedOptions.every(i => this.checkList.includes(i.label))) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
    },
  },
  methods: {
    toggle () {
      this.active = !this.active
    },
    selectHandler(val) {
      this.selectAll = val
      if (this.selectAll) {
        this.options.forEach(i => {
          if (i.show && !this.checkList.includes(i.label)) {
            this.checkList.push(i.label)
          }
        })
      }
      this.$emit('update:selectedValues', [...this.checkList])
    }
  }
}
</script>

<style scoped>
.wrapper-filter-select {
  position: relative;
}

.content {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 32px;
  left: 0;
  width: 100%;
  min-height: 40px;
  background-color: var(--white);
  box-shadow: 0px 3px 14px #0000000d;
}

.type-of-including-group,
.input-wrapper,
.checkbox-group,
.showing-wrapper {
  padding: 16px;
  border-bottom: 1px solid var(--dirty-white);
}

.checkbox-group {
  max-height: 350px;
  overflow-y: auto;
}

.type-of-including-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-wrapper:hover {
  cursor: text;
}

.showing-wrapper {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  text-align: left;
  color: #828282;
}

.one-line-text {
  width: 100%;
  overflow: hidden;
}

.one-line-text :deep() .el-checkbox__label {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
