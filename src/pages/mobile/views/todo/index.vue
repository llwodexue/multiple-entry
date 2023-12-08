<template>
  <div class="mobile-todo">
    <div class="search">
      <div style="cursor: pointer" @click="handleSearchClick">
        <van-icon name="filter-o" />
        <span>筛选</span>
      </div>
    </div>
    <todo-search :show.sync="showSearch" :sender-options="senderOptions" @search="handleSearch" />

    <van-tabs v-model="activeTabName" @click="handleTabClick">
      <van-tab v-for="item in tabConfig" :key="item.name" :name="item.name" :title="item.title">
        <template #title>
          <span>{{ item.title }}</span>
          <span v-if="activeTabName === item.name" style="margin-left: 6px; color: red">
            {{ total }}
          </span>
        </template>

        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
          <van-cell v-for="(item, index) in list" :key="index" @click="handleDetailClick(item)">
              <template #title>
                <van-tag
                  v-if="item.isUrge == 0"
                  class="tag"
                  style="margin-right: 2px"
                  type="danger"
                >
                  催办
                </van-tag>
                <span class="todo-title">{{ item.instancesName }}</span>
              </template>
              <template #label>
                <div style="display: flex; flex-direction: column">
                  <span class="system-name">应用系统：{{ item.systemName }}</span>
                  <span class="send-user-name">发送人：{{ item.sendUserName }}</span>
                  <span class="input-time">时间：{{ item.inputTime }}</span>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { tabConfig } from './config/tab.config'
import TodoSearch from './children/todo-search'
import { encrypt } from '@/utils/encryp'

export default {
  components: { TodoSearch },
  data() {
    return {
      searchInfo: {},
      showSearch: false,
      tabConfig,
      activeTabName: tabConfig[0].name,
      total: null,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageInfo: {
        page: 0,
        size: 10
      },
      senderOptions: []
    }
  },
  computed: {
    ...mapGetters(['uid']),
    pageQueryInfo() {
      const { id: pageName, defaultQueryInfo } = this.tabConfig.find(
        item => item.name === this.activeTabName
      )
      return { pageName, defaultQueryInfo }
    }
  },
  mounted() {
    this.getSenderData()
  },
  methods: {
    async getSenderData() {
      const { pageName, defaultQueryInfo } = this.pageQueryInfo
      // const res = await operationPageData(pageName, 'query_sender', defaultQueryInfo)
      this.senderOptions = res.data ?? []
    },
    handleSearchClick() {
      this.showSearch = true
    },
    handleDetailClick(item) {
      const encryptUrl = this.handleDetailUrl(item)
      window.open(encryptUrl, '_blank')
    },
    handleDetailUrl(item) {
      const { jumpField } = this.tabConfig.find(item => item.name === this.activeTabName)

      const params = 'uid=' + this.uid + '&' + jumpField + '=' + item[jumpField]
      const encryptUrl = item.mobileUrl + '?' + encrypt(params)
      return encryptUrl
    },
    handleTabClick(name, title) {
      this.refreshing = true
      this.onRefresh()
      this.getSenderData()
    },
    handleSearch(value) {
      this.searchInfo = { ...value }
      this.refreshing = true
      this.onRefresh()
      this.getSenderData()
    },
    async onLoad() {
      this.total = null

      const { pageName, defaultQueryInfo } = this.pageQueryInfo

      if (this.refreshing) {
        this.pageInfo.page = 0
        this.list = []
        this.refreshing = false
      }

      const params = {
        page: ++this.pageInfo.page,
        size: this.pageInfo.size,
        ...this.searchInfo,
        ...defaultQueryInfo
      }

      const result = await operationPageData(pageName, 'query', params)
      const { list, total } = result.data

      for (const item of list) {
        this.list.push(item)
      }
      this.total = total

      this.loading = false

      if (this.list.length >= total) {
        this.finished = true
      }
    },
    onRefresh() {
      this.finished = false
      this.loading = true
      this.onLoad()
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 8px;
}
</style>
