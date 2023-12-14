<template>
  <el-dialog :visible.sync="isShowSearch" fullscreen :show-close="false" append-to-body>
    <el-autocomplete
      ref="layoutMenuAutocompleteRef"
      v-model="menuQuery"
      :fetch-suggestions="menuSearch"
      placeholder="菜单搜索：支持中文、路由路径"
      prefix-icon="el-icon-search"
      @select="onHandleSelect"
      @blur="onSearchBlur"
    >
      <template slot-scope="{ item }">
        <item :icon="item.meta.icon" :title="item.meta.title" />
      </template>
    </el-autocomplete>
  </el-dialog>
</template>

<script>
import Item from '../Sidebar/Item'
export default {
  name: 'BreadcrumbSearch',
  components: { Item },
  data() {
    return {
      isShowSearch: false,
      menuQuery: '',
      tagsViewList: []
    }
  },
  methods: {
    // 搜索弹窗打开
    openSearch() {
      this.menuQuery = ''
      this.isShowSearch = true
      this.initTagView()
      this.$nextTick(() => {
        this.$refs.layoutMenuAutocompleteRef.focus()
      })
    },
    // 搜索弹窗关闭
    closeSearch() {
      setTimeout(() => {
        this.isShowSearch = false
      }, 150)
    },
    // 菜单搜索数据过滤
    menuSearch(queryString, cb) {
      const results = queryString ? this.tagsViewList.filter(this.createFilter(queryString)) : this.tagsViewList
      cb(results)
    },
    // 菜单搜索过滤
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
          restaurant.meta.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        )
      }
    },
    // 初始化菜单数据
    initTagView() {
      if (this.tagsViewList.length > 0) return false
      this.$store.state.permission.flattenRoutes.map(v => {
        if (!v.hidden) this.tagsViewList.push({ ...v })
      })
    },
    // 当前菜单选中时
    onHandleSelect(item) {
      const { redirect, name } = item
      if (item.meta.isLink && !item.meta.isIframe) window.open(item.meta.isLink)
      else if (redirect) this.$router.push(redirect)
      else this.$router.push({ name: name })
      this.closeSearch()
    },
    // input 失去焦点时
    onSearchBlur() {
      this.closeSearch()
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-dialog) {
  box-shadow: unset !important;
  border-radius: 0 !important;
  background: rgba(0, 0, 0, 0.5);
}
:deep(.el-dialog .el-dialog__header) {
  display: none;
}
:deep(.el-autocomplete) {
  width: 560px;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}
.svg-icon {
  margin-right: 16px;
}
</style>
