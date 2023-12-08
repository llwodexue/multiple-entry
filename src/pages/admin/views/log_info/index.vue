<template>
  <div class="log_info">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="日志类型">
              <el-input v-model="form.logType" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关联请求模板">
              <el-input v-model="form.templateId" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关联任务模板">
              <el-input v-model="form.taskId" />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display: flex; justify-content: center">
            <el-button plain @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="custom-table">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column align="center" prop="logId" label="日志编号" />
        <el-table-column
          align="center"
          prop="logType"
          label="日志类型"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column align="center" prop="templateId" label="关联请求模板" min-width="100" />
        <el-table-column align="center" prop="taskId" label="关联任务模板" min-width="100" />
        <el-table-column align="center" prop="code" label="响应状态" />
        <el-table-column align="center" prop="respType" label="请求方式" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination" style="text-align: right">
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
    </div>
    <DetailsModal ref="detailsModalRef" :default-info="rowData" />
  </div>
</template>

<script>
import { queryByPage } from '@admin/api/log_info'
import { deepClone } from '@/utils'
import DetailsModal from './components/DetailsModal'

const defaultForm = {
  logType: '',
  templateId: '',
  taskId: ''
}

export default {
  components: {
    DetailsModal
  },
  data() {
    return {
      form: deepClone(defaultForm),
      tableData: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      rowData: {}
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.loading = true
      try {
        const result = await queryByPage({ page: this.page, size: this.size }, this.form)
        const { content, totalElements } = result
        this.tableData = content
        this.total = totalElements
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    handleReset() {
      this.form = deepClone(defaultForm)
      this.getTableData()
    },
    handleSearch() {
      this.getTableData()
    },
    handleView(row) {
      this.$refs.detailsModalRef.dialogVisible = true
      this.rowData = { ...row }
    },
    handleSizeChange(size) {
      this.size = size
      this.getTableData()
    },
    handleCurrentPageChange(page) {
      this.page = page
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
