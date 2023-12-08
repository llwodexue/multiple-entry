<template>
  <div class="">
    <van-popup
      v-model="popupVisible"
      closeable
      close-icon-position="top-left"
      position="right"
      :close-on-click-overlay="false"
      :close="handleCancel"
      :style="{ height: '100%', width: '80%' }"
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils'

const defaultSearchInfo = {}

export default {
  data() {
    return {
      popupVisible: false,
      searchInfo: deepClone(defaultSearchInfo)
    }
  },
  methods: {
    handleCancel() {
      this.popupVisible = false
      this.searchInfo = deepClone(defaultSearchInfo)
    }
  }
}
</script>

<style lang="scss" scoped></style>
