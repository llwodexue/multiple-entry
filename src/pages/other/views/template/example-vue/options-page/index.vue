<template>
  <div class="app-container">
    <div v-show="showSearch" class="table-search">
      <el-form ref="queryRef" :model="queryParams" :inline="true">
        <el-form-item label="查询日期-options">
          <el-date-picker
            v-model="queryParams.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择查询日期"
            :picker-options="datePickerOptions"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="日期范围-options">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期范围"
            :picker-options="datePickerOptions"
            start-placeholder="起始日期"
            end-placeholder="截止日期"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <div class="btn-container">
        <div class="btn">
          <el-button v-hasPermission="['ticket:operator:save']" type="primary" plain icon="el-icon-plus" @click="handleAdd">
            新增
          </el-button>
          <el-button
            v-hasPermission="['ticket:operator:update']"
            type="success"
            plain
            icon="el-icon-edit"
            :disabled="single"
            @click="handleUpdate"
          >
            修改
          </el-button>
          <el-button
            v-hasPermission="['ticket:operator:delete']"
            type="danger"
            plain
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
          >
            删除
          </el-button>
        </div>
        <RightToolbar :show-search.sync="showSearch" :columns.sync="columns" @queryTable="getList" />
      </div>

      <VTable ref="tableRef" :loading="loading" :table-data="dataList" :table-header="columns" @selection-change="selectChange" />

      <Pagination :page.sync="queryParams.pageNumber" :limit.sync="queryParams.pageSize" :total="total" @pagination="getList" />
    </div>

    <el-dialog :visible.sync="configOpen" :title="configTitle" width="800px" append-to-body>
      <el-form ref="configRef" :model="formData" :rules="rulesData" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期" prop="date">
              <el-date-picker
                v-model="formData.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" clearable placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="formData.address" clearable placeholder="请输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="configOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useDebounceFn } from '@vueuse/core'
import VTable from '@/components/VTable'
import { columns } from './config/tableConfig'
import { deepClone, addDateRange } from '@/utils'
import { datePickerOptions } from '@/utils/constants'

export default {
  name: 'OptionsPage',
  components: {
    VTable
  },
  data() {
    return {
      dataList: [],
      idsList: [],
      dateRange: [],
      loading: false,
      total: 0,
      single: true,
      multiple: true,
      configOpen: false,
      configTitle: '',
      saveType: 'add',
      showSearch: true,
      queryParams: {
        pageNumber: 1,
        pageSize: 20,
        date: ''
      },
      formData: {},
      rulesData: {},
      columns,
      datePickerOptions
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = addDateRange(this.queryParams, this.dateRange, 'Time')
      console.log(params)
      setTimeout(() => {
        const date = this.$parseTime(new Date(), '{y}-{m}-{d}')
        this.dataList = [
          {
            date: date,
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: date,
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          },
          {
            date: date,
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          },
          {
            date: date,
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ]
        this.total = this.dataList.length
        this.loading = false
      }, 300)
    },
    debouncedQuery() {
      useDebounceFn(() => {
        this.queryParams.pageNumber = 1
        this.getList()
      })
    },
    handleQuery() {
      this.debouncedQuery()
    },
    selectChange(selection) {
      this.idsList = selection
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    reset() {
      this.formData = {
        date: '',
        name: '',
        address: ''
      }
      this.$resetForm('configRef')
    },
    handleAdd() {
      this.reset()
      this.configOpen = true
      this.configTitle = '新增xx'
      this.this.saveType = 'add'
    },
    handleUpdate() {
      this.reset()
      this.configOpen = true
      this.configTitle = '修改xx'
      this.saveType = 'save'
      this.formData = deepClone(this.idsList[0])
    },
    handleDelete() {
      const delConfig = () => Promise.resolve({ code: 200, data: null, msg: '操作成功' })
      const ids = this.idsList.map(i => i.name)
      this.$modal
        .confirm('是否确认删除选中的数据项？')
        .then(() => delConfig({ ids: ids.join(',') }))
        .then(res => {
          if (res.code === 200) {
            this.$modal.msgSuccess('删除成功')
            this.getList()
          }
        })
        .catch(() => {})
    },
    submitForm() {
      const addConfig = () => Promise.resolve({ code: 200, data: null, msg: '操作成功' })
      const updateConfig = () => Promise.resolve({ code: 200, data: null, msg: '操作成功' })
      this.$refs['configRef'].validate(valid => {
        if (valid) {
          if (this.saveType === 'add') {
            addConfig(this.formData).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('新增成功')
                this.configOpen = false
                this.getList()
              }
            })
          } else {
            updateConfig(this.formData).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('修改成功')
                this.configOpen = false
                this.getList()
              }
            })
          }
        }
      })
    }
  }
}
</script>
