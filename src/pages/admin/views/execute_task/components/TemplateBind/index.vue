<template>
  <div class="custom-dialog">
    <el-dialog
      title="模板关联"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      destroy-on-close
      width="60%"
    >
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px">
        <div>
          <el-button v-if="!isBind" type="text" @click="handleChangeState(true)">切换已关联模板列表</el-button>
          <el-button v-if="isBind" type="text" @click="handleChangeState(false)">切换未关联模板列表</el-button>
        </div>
        <el-input v-model="searchForm.templateName" placeholder="模板名称" style="width: 240px" @blur="getTempTableData" />
      </div>
      <el-table v-loading="loading" :data="templateTableData" border style="width: 100%" @selection-change="handleSelection">
        <el-table-column align="center" type="selection" width="40" />
        <el-table-column align="center" prop="templateId" label="模板编号" width="120" />
        <el-table-column align="center" prop="templateName" label="模板名称" show-overflow-tooltip />
        <el-table-column align="center" prop="templateType" label="模板类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ selectEchoDic(TEMPLATE_TYPE, scope.row.templateType) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="requestType" label="请求方式" width="100" />
      </el-table>
      <div class="pagination" style="text-align: right; margin-bottom: 10px">
        <el-pagination
          :current-page="page"
          :page-sizes="[5, 10, 15]"
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
import { queryRelationByPage, queryNoRelationByPage, bind, unBind } from '@admin/api/http_template'
import { TEMPLATE_TYPE } from '@/constants'

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
      TEMPLATE_TYPE,
      loading: false,
      dialogVisible: false,
      templateTableData: [],
      selections: [],
      page: 1,
      size: 5,
      total: 0,
      executeId: null,
      searchForm: {
        templateName: '',
        executeId: ''
      },
      isBind: false
    }
  },
  watch: {
    defaultInfo: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (newValue) {
        this.executeId = newValue.executeId
        this.searchForm.executeId = this.executeId
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
      const templateList = []
      this.selections.forEach(item => {
        templateList.push(item.templateId)
      })
      const params = {
        executeId: this.executeId,
        templateList
      }
      await bind(params)
      this.getTempTableData()
    },
    async handleCancelBind() {
      const templateList = []
      this.selections.forEach(item => {
        templateList.push(item.templateId)
      })
      const params = {
        executeId: this.executeId,
        templateList
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

<style lang="scss" scoped>
:deep(.el-input__inner) {
  border-radius: 50px;
}
</style>
