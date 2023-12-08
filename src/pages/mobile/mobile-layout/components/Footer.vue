<template>
  <div class="footer-wrapper">
    <van-tabbar v-model="activeTab" @change="handleMenuChange">
      <van-tabbar-item
        v-for="menu in menus"
        :key="menu.name"
        :to="{ name: menu.name }"
        :name="menu.name"
        :icon="menu.icon"
      >
        {{ menu.label }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      activeTab: ''
    }
  },
  computed: {
    ...mapGetters(['permission_routes']),
    activeMenu() {
      const { meta } = this.$route
      return meta.name
    },
    menus() {
      const tempMenus = []
      this.permission_routes
        .forEach(item => {
          if (item.children) {
            tempMenus.push(item.children[0]?.meta)
          }
        })
      return tempMenus
    }
  },
  watch: {
    activeMenu: {
      handler: function() {
        this.activeTab = this.activeMenu
      },
      immediate: true
    }
  },
  methods: {
    handleMenuChange() {}
  }
}
</script>
