<template>
  <div class="class_template">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="90px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="全类名">
              <el-input v-model="form.className" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类加载类型">
              <el-select v-model="form.classType" placeholder="" style="width: 100%" clearable>
                <el-option v-for="item in CLASS_TYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="bean名称">
              <el-input v-model="form.beanName" />
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
        <el-table-column align="center" prop="classId" label="类加载编号" min-width="100" />
        <el-table-column align="center" prop="className" label="全类名" min-width="200" show-overflow-tooltip />
        <el-table-column align="center" prop="classType" label="类加载类型" min-width="100">
          <template slot-scope="scope">
            {{ selectEchoDic(CLASS_TYPE, scope.row.classType) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="beanName" label="bean名称" min-width="90" show-overflow-tooltip />
        <el-table-column align="center" prop="isOpen" label="是否启用">
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
                <el-dropdown-item :disabled="scope.row.isOpen == 0">
                  <span @click="handleLoad(scope.row)">加载</span>
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
    <TemplateUploadModal ref="templateUploadModalRef" :get-table-data="getTableData" />
    <TemplateModal ref="templateModalRef" :default-info="templateForm" :get-table-data="getTableData" />
    <DetailsModal ref="detailsModalRef" :default-info="templateForm" />
  </div>
</template>

<script>
import { queryByPage, deleteById, loadClass } from '@admin/api/class_template'
import TemplateUploadModal from './components/TemplateUploadModal'
import TemplateModal from './components/TemplateModal'
import DetailsModal from './components/DetailsModal'
import { deepClone } from '@/utils'
import { CLASS_TYPE } from '@/constants'

const defaultForm = {
  className: '',
  classType: '',
  beanName: ''
}

export default {
  components: {
    TemplateUploadModal,
    TemplateModal,
    DetailsModal
  },
  data() {
    return {
      CLASS_TYPE,
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
    handleDel(row) {
      this.$modal.confirm(`是否确认删除类加载编号为"${row.classId}"的数据项?`).then(() => {
        this.delete(row.classId)
      })
    },
    async delete(id) {
      await deleteById({ id })
      this.$modal.msgSuccess('删除成功!')
      this.getTableData()
    },
    async handleLoad(row) {
      await loadClass({ id: row.classId })
      this.$modal.msgSuccess('加载成功!')
      this.getTableData()
    },
    handleAdd() {
      this.$refs.templateUploadModalRef.dialogVisible = true
    },
    handleEdit(row) {
      this.$refs.templateModalRef.dialogVisible = true
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
</style>
