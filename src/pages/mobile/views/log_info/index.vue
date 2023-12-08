<template>
  <div class="log_info">
    <div class="search">
      <div @click="handleSearch">
        <van-icon name="filter-o" />
        <span>筛选</span>
      </div>
    </div>
    <div class="list">
      <van-pull-refresh v-model="refreshing" @refresh="handleRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getListData"
        >
          <van-cell v-for="(item, index) in list" :key="index" @click="handleView(item)">
            <template #title>
              <span class="todo-title">{{ item.name }}</span>
            </template>
            <template #label>
              <div style="display: flex; flex-direction: column">
                <span class="system-name">响应状态{{ 'xxx' }}</span>
                <span class="send-user-name">请求方式：{{ 'xxx' }}</span>
              </div>
            </template>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
    <SearchModal ref="searchModalRef" @search="search" />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import SearchModal from './components/SearchModal'

export default {
  components: {
    SearchModal
  },
  data() {
    return {
      searchInfo: {},
      total: null,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageInfo: {
        page: 0,
        size: 10
      }
    }
  },
  mounted() {},
  methods: {
    handleSearch() {
      // this.$refs.searchModalRef.popupVisible = true
    },
    search(searchInfo) {
      this.searchInfo = deepClone(searchInfo)
      this.refreshing = true
      this.handleRefresh()
    },
    handleRefresh() {
      this.finished = false
      this.loading = true
      this.getListData()
    },
    async getListData() {
      this.total = null
      if (this.refreshing) {
        this.pageInfo.page = 0
        this.list = []
        this.refreshing = false
      }

      // const params = {
      //   page: this.pageInfo.page++,
      //   size: this.pageInfo.size,
      //   ...this.searchInfo
      // }

      try {
        // const result = await operationPageData(pageName, 'query', params)
        const result = {
          data: {
            list: [],
            total: 0
          }
        }
        const { list, total } = result.data

        for (const item of list) {
          this.list.push(item)
        }
        this.total = total

        this.loading = false

        if (this.list.length >= total) {
          this.finished = true
        }
      } catch (error) {
        this.loading = false
      }
    },
    handleView(item) {}
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: absolute;
  right: 10px;
  top: 16px;
  z-index: 999;
  cursor: pointer;
}
</style>
