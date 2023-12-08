<template>
  <div class="execute_task">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="任务分组">
              <el-input v-model="form.jobGroup" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名称">
              <el-input v-model="form.jobName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否启用">
              <el-select v-model="form.isOpen" clearable placeholder="" style="width: 100%">
                <el-option label="启用" :value="0" />
                <el-option label="停用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务描述">
              <el-input v-model="form.taskDescription" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="流程模板">
              <el-input v-model="form.workflowCode" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="form.state" clearable placeholder="" style="width: 100%">
                <el-option v-for="item in STATE" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table-column align="center" prop="taskId" label="任务编号" />
        <el-table-column align="center" prop="taskDescription" label="任务描述" width="260" show-overflow-tooltip />
        <el-table-column align="center" prop="jobGroup" label="任务分组" />
        <el-table-column align="center" prop="jobName" label="任务名称" width="200" show-overflow-tooltip />
        <el-table-column align="center" prop="beanClass" label="执行方法" width="230" show-overflow-tooltip />
        <el-table-column align="center" prop="executeId" label="绑定执行编号" width="110" show-overflow-tooltip />
        <el-table-column align="center" prop="cronExpression" label="调用cron" />
        <el-table-column align="center" prop="jobStatus" label="工作任务状态" width="110">
          <template slot-scope="scope">
            {{ { normal: '正常', stop: '停止' }[scope.row.jobStatus] }}
          </template>
        </el-table-column>
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
                  <span v-if="scope.row.jobStatus == 'normal'" @click="handlePause(scope.row)">暂停</span>
                  <span v-if="scope.row.jobStatus == 'stop'" @click="handleResume(scope.row)">恢复</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span v-if="scope.row.isOpen == 0" @click="handleStop(scope.row)">停止</span>
                  <span v-if="scope.row.isOpen == 1" @click="handleStart(scope.row)">启动</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="handleBind(scope.row)">模版关联</span>
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
    <TaskModal ref="taskModalRef" :is-edit="isEdit" :default-info="taskForm" :get-table-data="getTableData" />
    <TemplateBind ref="templateBindRef" :default-info="templateForm" :get-table-data="getTableData" />
    <DetailsModal ref="detailsModalRef" :default-info="templateForm" />
  </div>
</template>

<script>
import { queryByPage, deleteById, pause, resume, start, stop } from '@admin/api/execute_task'
import TemplateBind from './components/TemplateBind'
import TaskModal from './components/TaskModal'
import DetailsModal from './components/DetailsModal'
import { deepClone } from '@/utils'
import { STATE } from '@/constants'

const defaultForm = {
  jobGroup: '',
  jobName: '',
  isOpen: '',
  taskDescription: '',
  workflowCode: '',
  state: ''
}

export default {
  components: {
    TemplateBind,
    TaskModal,
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
      taskForm: {},
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
      this.$modal.confirm(`是否确认删除任务编号为"${row.taskId}"的数据项?`).then(() => {
        this.delete(row.taskId)
      })
    },
    async delete(id) {
      await deleteById({ id })
      this.$modal.msgSuccess('删除成功!')
      this.getTableData()
    },
    async handlePause(row) {
      await pause({ id: row.taskId })
      this.$modal.msgSuccess('操作成功!')
      this.getTableData()
    },
    async handleResume(row) {
      await resume({ id: row.taskId })
      this.$modal.msgSuccess('操作成功!')
      this.getTableData()
    },
    async handleStop(row) {
      await stop({ id: row.taskId })
      this.$modal.msgSuccess('操作成功!')
      this.getTableData()
    },
    async handleStart(row) {
      await start({ id: row.taskId })
      this.$modal.msgSuccess('操作成功!')
      this.getTableData()
    },
    handleBind(row) {
      this.$refs.templateBindRef.dialogVisible = true
      this.templateForm = { ...row }
    },
    handleAdd() {
      this.$refs.taskModalRef.dialogVisible = true
      this.isEdit = false
    },
    handleEdit(row) {
      this.$refs.taskModalRef.dialogVisible = true
      this.isEdit = true
      this.taskForm = { ...row }
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
