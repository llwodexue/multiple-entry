<!-- 甘特图标签 -->
<template>
  <div
    ref="dragBoxRef"
    :class="['tagItem', showSelected && tagItem.selected ? 'selected' : '']"
    :style="tagItem.style"
    tabindex="-2"
  >
    <!-- 不显示 tip -->
    <template v-if="closeTip">
      <!-- 显示的tag值 -->
      <span :class="['tagLabel', tagItem.className]">
        <tagItemLabel :tag-item="tagItem" />
      </span>
    </template>
    <template v-else>
      <Popover
        v-model="visibleTip"
        popper-class="ganTTTagTip"
        placement="right"
        width="206"
        trigger="manual"
        :visible-arrow="false"
        :offset="0"
      >
        <!-- tag tip 插槽 -->
        <slot name="tagTip" :tag-data="tagItem">
          {{ tagItem.label }}
        </slot>
        <span
          slot="reference"
          :class="['tagLabel', tagItem.className]"
          @pointerenter="showTagTip(true)"
          @pointermove="showTagTip(true)"
          @pointerleave="showTagTip(false)"
        >
          <!-- 显示的tag值 -->
          <TagItemLabel :tag-item="tagItem" />
        </span>
      </Popover>
    </template>
  </div>
</template>

<script setup>
import { Popover } from 'element-ui'
import { ref } from 'vue'
import TagItemLabel from './TagItemLabel.vue'

defineProps({
  tagItem: {
    type: Object,
    default() {
      return {}
    }
  },
  // 是否显示tag选中 - false 不会显示选中效果
  showSelected: {
    type: Boolean,
    default: false
  },
  // 是否关闭 tip，默认显示tip
  closeTip: {
    type: Boolean,
    default: false
  }
})

const visibleTip = ref(false)
const showTagTip = (bool = false) => {
  visibleTip.value = bool
}
</script>

<style lang="scss" scoped>
// 画布内tag
.tagItem {
  position: absolute;
  width: 0;
  height: 0;
  left: 0;
  top: 0;
  z-index: 4;
  background-color: #365be4;
  // padding: 3px;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: transform ease 0.2s;

  &.dragable {
    cursor: move;
  }

  &.moving {
    // cursor: move;
    box-shadow: rgb(1, 10, 21) 0px 0px 16px;
    z-index: 9;
  }

  // 是否选中
  &.selected {
    outline: 2px dashed red;
  }

  .tagLabel {
    // line-height: normal;
    // pointer-events: none;
    user-select: none;
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 15px;
    box-sizing: border-box;
  }

  :deep(> span) {
    width: 100%;
    height: 100%;
  }

  :deep(.el-popover__reference-wrapper) {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss">
$theme: rgba(17, 21, 43, 0.75);

.ganTTTagTip {
  background-color: $theme;
  color: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 10px;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 500;

  $mg: 5px;

  &.el-popper[x-placement^='left'] {
    margin-right: $mg;

    .popper__arrow::after {
      border-left-color: $theme;
    }
  }

  &.el-popper[x-placement^='right'] {
    margin-left: $mg;

    .popper__arrow::after {
      border-right-color: $theme;
    }
  }

  &.el-popper[x-placement^='top'] {
    margin-bottom: $mg;

    .popper__arrow::after {
      border-top-color: $theme;
    }
  }

  &.el-popper[x-placement^='bottom'] {
    margin-top: $mg;

    .popper__arrow::after {
      border-bottom-color: $theme;
    }
  }
}
</style>
