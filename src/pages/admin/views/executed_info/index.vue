<template>
  <div class="executed_info">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="90px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="流程编号">
              <el-input v-model="form.instanceId" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流程名称">
              <el-input v-model="form.workflowName" />
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
        <el-table-column align="center" prop="executedId" label="已执行流程编号" width="120" />
        <el-table-column align="center" prop="taskId" label="关联任务" />
        <el-table-column align="center" prop="instanceId" label="流程编号" show-overflow-tooltip />
        <el-table-column align="center" prop="executedType" label="已执行流程类型" width="120" />
        <el-table-column align="center" prop="executedCode" label="执行结果状态" width="110" />
        <el-table-column
          align="center"
          prop="workflowName"
          label="流程名称"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="sequenceNo"
          label="流程流水号"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column fixed="right" align="center" label="操作" width="100">
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
    <DetailsModal ref="detailsModalRef" :default-info="templateForm" />
  </div>
</template>

<script>
import { queryByPage } from '@admin/api/executed_info'
import DetailsModal from './components/DetailsModal'
import { deepClone } from '@/utils'

const defaultForm = {
  instanceId: '',
  workflowName: ''
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
      templateForm: {}
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
      this.templateForm = { ...row }
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
