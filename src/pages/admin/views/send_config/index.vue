<template>
  <div class="send_config">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="90px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="消息类型">
              <el-select v-model="form.sendType" clearable placeholder="" style="width: 100%">
                <el-option v-for="item in SEND_TYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息标题">
              <el-input v-model="form.sendTitle" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息推送人姓名" label-width="110px">
              <el-input v-model="form.sendUsername" />
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
        <el-table-column align="center" prop="sendId" label="消息推送编号" min-width="110" />
        <el-table-column align="center" prop="sendName" label="模板名称" show-overflow-tooltip />
        <el-table-column align="center" prop="sendType" label="消息类型" />
        <el-table-column align="center" prop="sendTitle" label="消息标题" show-overflow-tooltip />
        <el-table-column align="center" prop="sendUser" label="消息推送人" min-width="100" show-overflow-tooltip />
        <el-table-column align="center" prop="sendUsername" label="消息推送人姓名" min-width="120" show-overflow-tooltip />
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
import { queryByPage, deleteById } from '@admin/api/send_config'
import TemplateModal from './components/TemplateModal'
import DetailsModal from './components/DetailsModal'
import { deepClone } from '@/utils'
import { SEND_TYPE } from '@/constants'

const defaultForm = {
  sendType: '',
  sendTitle: '',
  sendUsername: ''
}

export default {
  components: {
    TemplateModal,
    DetailsModal
  },
  data() {
    return {
      SEND_TYPE,
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
      this.$modal.confirm(`是否确认删除消息推送编号为"${row.sendId}"的数据项?`).then(() => {
        this.delete(row.sendId)
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
