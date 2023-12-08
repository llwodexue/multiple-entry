<template>
  <div class="mobile-app-wrapper">
    <mobile-header />
    <div class="content">
      <router-view />
    </div>
    <mobile-footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  components: {
    MobileFooter: Footer,
    MobileHeader: Header
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 50px;
}
</style>
