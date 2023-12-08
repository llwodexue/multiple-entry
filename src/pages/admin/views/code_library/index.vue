<template>
  <div class="code_library">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="码值编号">
              <el-input v-model="form.codeNo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转码编号">
              <el-input v-model="form.itemNo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转码值">
              <el-input v-model="form.itemName" />
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
        <el-table-column align="center" prop="codeNo" label="码值编号" />
        <el-table-column align="center" prop="itemNo" label="转码编号" />
        <el-table-column align="center" prop="itemName" label="转码值" show-overflow-tooltip />
        <el-table-column align="center" prop="itemParam" label="参数" show-overflow-tooltip />
        <el-table-column align="center" prop="sortNo" label="排序号" width="100" />
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
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
  </div>
</template>

<script>
import { queryByPage, deleteById } from '@admin/api/code_library'
import TemplateModal from './components/TemplateModal'
import { deepClone } from '@/utils'

const defaultForm = {
  codeNo: '',
  itemNo: '',
  itemName: ''
}

export default {
  components: {
    TemplateModal
  },
  data() {
    return {
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
      this.$modal.confirm(`是否确认删除转码编号为"${row.itemNo}"的数据项?`).then(() => {
        this.delete(row.codeNo, row.itemNo)
      })
    },
    async delete(codeNo, itemNo) {
      await deleteById({ codeNo, itemNo })
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
