<template>
  <div class="header-wrapper">
    <van-nav-bar @click-left="handleBarLeftClick" @click-right="handleBarRightClick">
      <template #left>
        <van-image width="100%" height="80%" :src="require('@/assets/logo.png')" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleBarLeftClick() {},
    handleBarRightClick() {}
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
}
:deep(.van-nav-bar__left) {
  padding: 0;
}
</style>
