<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        const name = process.env.VUE_APP_ADMIN_TITLE
        return title ? `${title} - ${name}` : name
      }
    }
  }
}
</script>
