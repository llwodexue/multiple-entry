<template>
  <div class="custom-dialog">
    <el-dialog
      title="用户绑定"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      destroy-on-close
      width="60%"
    >
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px">
        <div>
          <el-button v-if="!isBind" type="text" @click="handleChangeState(true)">
            切换已绑定用户列表
          </el-button>
          <el-button v-if="isBind" type="text" @click="handleChangeState(false)">
            切换未绑定用户列表
          </el-button>
        </div>
        <div>
          <el-input
            v-model="searchForm.uid"
            placeholder="用户中心登录名"
            style="width: 150px; margin-right: 4px"
            @blur="getTempTableData"
          />
          <el-input
            v-model="searchForm.name"
            placeholder="用户姓名"
            style="width: 150px; margin-right: 4px"
            @blur="getTempTableData"
          />
          <el-input
            v-model="searchForm.orgname"
            placeholder="用户中心组织名称"
            style="width: 150px"
            @blur="getTempTableData"
          />
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="templateTableData"
        border
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column align="center" type="selection" width="40" />
        <el-table-column align="center" prop="uid" label="用户中心登录名" width="120" />
        <el-table-column align="center" prop="name" label="用户姓名" show-overflow-tooltip />
        <el-table-column align="center" prop="personid" label="用户编码" show-overflow-tooltip />
        <el-table-column align="center" prop="employeecode" label="员工号" show-overflow-tooltip />
        <el-table-column
          align="center"
          prop="orgcode"
          label="用户中心组织编码"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="orgname"
          label="用户中心组织名称"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column align="center" prop="status" label="是否未初始化">
          <template slot-scope="scope">
            {{ ['是', '否'][scope.row.status] }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="text-align: right; margin-bottom: 10px">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 30, 50]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: 10px">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button v-if="!isBind" type="primary" @click="handleBind">绑定</el-button>
        <el-button v-if="isBind" type="warning" @click="handleCancelBind">解除绑定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryRelationByPage, queryNoRelationByPage, bind, unBind } from '@admin/api/initflow_info'

export default {
  props: {
    defaultInfo: {
      type: Object,
      required: true
    },
    getTableData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      templateTableData: [],
      selections: [],
      page: 1,
      size: 10,
      total: 0,
      initflowId: null,
      searchForm: {
        uid: '',
        name: '',
        orgname: '',
        initflowId: ''
      },
      isBind: false
    }
  },
  watch: {
    defaultInfo: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (newValue) {
        this.initflowId = newValue.initflowId
        this.searchForm.initflowId = this.initflowId
        this.getTempTableData()
      },
      deep: true
    }
  },
  methods: {
    async getTempTableData() {
      this.loading = true
      try {
        const result = await (this.isBind ? queryRelationByPage : queryNoRelationByPage)(
          { page: this.page, size: this.size },
          this.searchForm
        )
        const { content, totalElements } = result
        this.templateTableData = content
        this.total = totalElements
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    handleCancel() {
      this.dialogVisible = false
      this.isBind = false
    },
    handleChangeState(isBind) {
      this.isBind = isBind
      this.getTempTableData()
    },
    async handleBind() {
      const uidList = []
      this.selections.forEach(item => {
        uidList.push(item.uid)
      })
      const params = {
        initflowId: this.initflowId,
        uidList
      }
      await bind(params)
      this.getTempTableData()
    },
    async handleCancelBind() {
      const uidList = []
      this.selections.forEach(item => {
        uidList.push(item.uid)
      })
      const params = {
        initflowId: this.initflowId,
        uidList
      }
      await unBind(params)
      this.getTempTableData()
    },
    handleSelection(selections) {
      this.selections = selections
    },
    handleSizeChange(size) {
      this.size = size
      this.getTempTableData()
    },
    handleCurrentPageChange(page) {
      this.page = page
      this.getTempTableData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
