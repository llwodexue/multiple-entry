<template>
  <div class="app-container">
    <div v-show="showSearch" class="table-search">
      <el-form ref="queryRef" :model="queryParams" :inline="true">
        <el-form-item label="查询日期-setup">
          <el-date-picker
            v-model="queryParams.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择查询日期"
            :picker-options="datePickerOptions"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="日期范围-setup">
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
export default {
  name: 'VuePage'
}
</script>
<script setup>
import { useDebounceFn } from '@vueuse/core'
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import VTable from '@/components/VTable'
import { columns } from './config/tableConfig'
import { deepClone, addDateRange } from '@/utils'
import { datePickerOptions } from '@/utils/constants'

const { proxy } = getCurrentInstance()
const dataList = ref([])
const idsList = ref([])
const dateRange = ref([])
const loading = ref(false)
const total = ref(0)
const single = ref(true)
const multiple = ref(true)
const tableRef = ref(null)
const configOpen = ref(false)
const configTitle = ref('')
const saveType = ref('add')
const showSearch = ref(true)

const data = reactive({
  queryParams: {
    pageNumber: 1,
    pageSize: 20,
    date: ''
  },
  formData: {},
  rulesData: {}
})
const { queryParams, formData, rulesData } = toRefs(data)

// 查询
function getList() {
  loading.value = true
  const params = addDateRange(queryParams.value, dateRange.value, 'Time')
  console.log(params)
  setTimeout(() => {
    const date = proxy.$parseTime(new Date(), '{y}-{m}-{d}')
    dataList.value = [
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
    total.value = dataList.value.length
    loading.value = false
  }, 300)
}
const debouncedQuery = useDebounceFn(() => {
  queryParams.value.pageNumber = 1
  getList()
})

function handleQuery() {
  debouncedQuery()
}

// 单选多选处理
function selectChange(selection) {
  idsList.value = selection
  single.value = selection.length !== 1
  multiple.value = !selection.length
}
// 新增修改之前的重置方法
function reset() {
  formData.value = {
    date: '',
    name: '',
    address: ''
  }
  proxy.$resetForm('configRef')
}
// 新增
function handleAdd() {
  reset()
  configOpen.value = true
  configTitle.value = '新增xx'
  saveType.value = 'add'
}

// 修改
function handleUpdate() {
  reset()
  configOpen.value = true
  configTitle.value = '修改xx'
  saveType.value = 'save'
  formData.value = deepClone(idsList.value[0])
}

// 删除
const delConfig = () => Promise.resolve({ code: 200, data: null, msg: '操作成功' })
function handleDelete() {
  const ids = idsList.value.map(i => i.name)
  proxy.$modal
    .confirm('是否确认删除选中的数据项？')
    .then(() => delConfig({ ids: ids.join(',') }))
    .then(res => {
      if (res.code === 200) {
        proxy.$modal.msgSuccess('删除成功')
        getList()
      }
    })
    .catch(() => {})
}

const addConfig = () => Promise.resolve({ code: 200, data: null, msg: '操作成功' })
const updateConfig = () => Promise.resolve({ code: 200, data: null, msg: '操作成功' })
// 提交表单
function submitForm() {
  proxy.$refs['configRef'].validate(valid => {
    if (valid) {
      if (saveType.value === 'add') {
        addConfig(formData.value).then(res => {
          if (res.code === 200) {
            proxy.$modal.msgSuccess('新增成功')
            configOpen.value = false
            getList()
          }
        })
      } else {
        updateConfig(formData.value).then(res => {
          if (res.code === 200) {
            proxy.$modal.msgSuccess('修改成功')
            configOpen.value = false
            getList()
          }
        })
      }
    }
  })
}

getList()
</script>
