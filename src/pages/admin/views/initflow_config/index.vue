<template>
  <div class="initflow_config">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="配置描述">
              <el-input v-model="form.initflowName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流程编码">
              <el-input v-model="form.workflowCode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发起人姓名" label-width="90px">
              <el-input v-model="form.userName" />
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
        <el-table-column align="center" prop="initflowId" label="编号" />
        <el-table-column align="center" prop="initflowName" label="配置描述" width="260" show-overflow-tooltip />
        <el-table-column align="center" prop="workflowCode" label="流程编码" show-overflow-tooltip />
        <el-table-column align="center" prop="finishStart" label="是否自动提交" width="110">
          <template slot-scope="scope">
            {{ ['是', '否'][scope.row.finishStart] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userName" label="发起人姓名" min-width="100" />
        <el-table-column align="center" prop="isOpen" label="是否启用" width="80">
          <template slot-scope="scope">
            {{ ['启用', '停用'][scope.row.isOpen] }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)">详情</el-button>
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-dropdown placement="bottom">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span @click="handleBind(scope.row)">用户绑定</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="handleDel(scope.row)">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    <UserBind ref="userBindRef" :default-info="templateForm" :get-table-data="getTableData" />
    <DetailsModal ref="detailsModalRef" :default-info="templateForm" />
  </div>
</template>

<script>
import { queryByPage, deleteById } from '@admin/api/initflow_config'
import TemplateModal from './components/TemplateModal'
import UserBind from './components/UserBind'
import DetailsModal from './components/DetailsModal'
import { deepClone } from '@/utils'
import { STATE } from '@/constants'

const defaultForm = {
  initflowName: '',
  workflowCode: '',
  userName: ''
}

export default {
  components: {
    TemplateModal,
    UserBind,
    DetailsModal
  },
  data() {
    return {
      STATE,
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
      this.$modal.confirm(`是否确认删除编号为"${row.initflowId}"的数据项?`).then(() => {
        this.delete(row.initflowId)
      })
    },
    async delete(id) {
      await deleteById({ id })
      this.$modal.msgSuccess('删除成功!')
      this.getTableData()
    },
    handleBind(row) {
      this.$refs.userBindRef.dialogVisible = true
      this.templateForm = { ...row }
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

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
:deep(.el-dropdown-menu__item) {
  text-align: center;
}
</style>
