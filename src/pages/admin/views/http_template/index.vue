<template>
  <div class="http_template">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="模板名称">
              <el-input v-model="form.templateName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模板类型">
              <el-select v-model="form.templateType" clearable placeholder="" style="width: 100%">
                <el-option v-for="item in TEMPLATE_TYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="请求方式">
              <el-select v-model="form.requestType" clearable placeholder="" style="width: 100%">
                <el-option label="POST" value="POST" />
                <el-option label="GET" value="GET" />
              </el-select>
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
      <div class="custom-table-tool">
        <div class="right" style="text-align: right">
          <el-button type="primary" @click="handleAdd">新建</el-button>
        </div>
      </div>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column align="center" prop="templateId" label="模板编号" />
        <el-table-column align="center" prop="templateName" label="模板名称" width="240" show-overflow-tooltip />
        <el-table-column align="center" prop="templateType" label="模板类型" width="260" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ selectEchoDic(TEMPLATE_TYPE, scope.row.templateType) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="requestType" label="请求方式" />
        <el-table-column align="center" prop="paramId" label="参数来源" show-overflow-tooltip />
        <el-table-column align="center" prop="isOpen" label="是否启用">
          <template slot-scope="scope">
            {{ ['启用', '停用'][scope.row.isOpen] }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)">详情</el-button>
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
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
    <TemplateModal ref="templateModalRef" :is-edit="isEdit" :default-info="templateForm" :get-table-data="getTableData" />
    <DetailsModal ref="detailsModalRef" :default-info="templateForm" />
  </div>
</template>

<script>
import { queryByPage, deleteById } from '@admin/api/http_template'
import TemplateModal from './components/TemplateModal'
import DetailsModal from './components/DetailsModal'
import { deepClone } from '@/utils'
import { TEMPLATE_TYPE } from '@/constants'

const defaultForm = {
  templateName: '',
  templateType: '',
  requestType: ''
}

export default {
  components: {
    TemplateModal,
    DetailsModal
  },
  data() {
    return {
      TEMPLATE_TYPE,
      form: deepClone(defaultForm),
      tableData: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      isEdit: false,
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
    handleDel(row) {
      this.$modal.confirm(`是否确认删除模板编号为"${row.templateId}"的数据项?`).then(() => {
        this.delete(row.templateId)
      })
    },
    async delete(id) {
      await deleteById({ id })
      this.$modal.msgSuccess('删除成功!')
      this.getTableData()
    },
    handleAdd() {
      this.$refs.templateModalRef.dialogVisible = true
      this.isEdit = false
    },
    handleEdit(row) {
      this.$refs.templateModalRef.dialogVisible = true
      this.isEdit = true
      this.templateForm = { ...row }
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
