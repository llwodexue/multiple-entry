<template>
  <div class="app-container">
    <div class="big-title">欢迎来到 {{ title }}</div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      title: process.env.VUE_APP_ADMIN_TITLE
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  /* height: 100%; */
  width: 100%;
  background: url('~@/assets/images/home.png') no-repeat 100% 100% / contain;
}
.big-title {
  padding-top: 180px;
  padding-left: 56px;
  font-family: PingFangSC-Medium;
  font-size: 32px;
  color: #23272e;
  letter-spacing: 0;
}
</style>
