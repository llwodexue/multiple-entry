<template>
  <div class="app-container">
    <div class="left-con">
      <div class="com-list">
        <div class="com-title">
          <svg-icon icon-class="component" />
          输入型组件
        </div>
        <DragClone :sort="false">
          <SuccessGate />
        </DragClone>
      </div>
    </div>

    <div class="right-con">
      <div class="drag-gate">
        <div class="gate-top">
          <svg-icon icon-class="gate" :class="['icon-gate', state.status]" />
        </div>
        <div class="gate-bottom">
          <el-input v-model="state.gateNo" maxlength="3" />
        </div>
      </div>
      <div style="height: 500px; width: 500px; border: 1px solid red; position: relative">
        <VueDraggableResizable :w="100" :h="100" :parent="true" @dragging="onDrag" @resizing="onResize">
          <p>
            Hello! I'm a flexible component. You can drag me around and you can resize me.
            <br />
            X: {{ x }} / Y: {{ y }} - Width: {{ width }} / Height: {{ height }}
          </p>
        </VueDraggableResizable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import DragClone from 'vuedraggable'
import VueDraggableResizable from 'vue-draggable-resizable'
import SuccessGate from './components/SuccessGate.vue'

const width = ref(0)
const height = ref(0)
const x = ref(0)
const y = ref(0)

// 创建一个响应式对象
const state = reactive({
  gateNo: 228,
  status: 'success'
})

const onResize = (x, y, width, height) => {
  x.value = x
  y.value = y
  width.value = width
  height.value = height
}
const onDrag = (x, y) => {
  x.value = x
  y.value = y
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: row;
  background-color: #e4e7ed;
  .left-con {
    background-color: #fff;
    width: 150px;
  }
  .right-con {
    display: flex;
  }
}
.com-list {
  padding: 8px;
  box-sizing: border-box;
  height: 100%;
  .com-item {
    display: inline-block;
    width: 48%;
    margin: 1%;
    transition: transform 0ms !important;
  }
  .com-title {
    font-size: 14px;
    color: #222;
    margin: 6px 2px;
    .svg-icon {
      color: #666;
      font-size: 18px;
    }
  }
}
.drag-gate {
  width: 72px;
  height: 94px;
  border: 1px solid #e4e7ed;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .gate-top {
    height: 75px;
  }
  .icon-gate {
    margin-top: 12px;
    width: 44px;
    height: 44px;
  }
  .success {
    color: #389e0d;
  }
  .error {
    color: #bf1622;
  }
  .gate-bottom {
    height: 24px;
    width: 100%;
    border-top: 1px solid #e4e7ed;
    :deep(.el-input__inner),
    :deep(.el-input__wrapper) {
      height: 24px;
      box-shadow: none;
      text-align: center;
      background-color: transparent;
    }
  }
}
</style>
