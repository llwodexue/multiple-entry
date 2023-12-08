<template>
  <div class="custom-dialog">
    <el-dialog
      :title="(isEdit ? '编辑' : '新建') + '执行任务'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      destroy-on-close
      width="60%"
    >
      <el-form ref="taskForm" :model="taskForm" :rules="taskFormRules" label-width="190px">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="systemConfig">
            <template slot="title">
              <span class="collapse-title">系统配置</span>
            </template>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="任务分组" prop="jobGroup">
                  <el-input v-model="taskForm.jobGroup" :disabled="isEdit" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="任务名称" prop="jobName">
                  <el-input v-model="taskForm.jobName" :disabled="isEdit" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="执行方法" prop="beanClass">
                  <el-select v-model="taskForm.beanClass" placeholder="" style="width: 100%">
                    <el-option
                      v-for="item in beanClassData"
                      :key="item.classId"
                      :label="item.className"
                      :value="item.className"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="绑定执行编号" prop="executeId">
                  <el-input v-model="taskForm.executeId" :disabled="isEdit" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="时间类型" prop="timeType">
                  <el-select v-model="taskForm.timeType" placeholder="" style="width: 100%" filterable @change="handleSelectCode">
                    <el-option
                      v-for="(item, index) in codeLibraryData"
                      :key="index"
                      :label="item.itemName"
                      :value="{ value: item.itemParam, label: item.itemName }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="调用cron" prop="cronExpression">
                  <el-input v-model="taskForm.cronExpression" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="工作任务状态" prop="jobStatus">
                  <el-select v-model="taskForm.jobStatus" clearable placeholder="" style="width: 100%">
                    <el-option label="正常" value="normal" />
                    <el-option label="停止" value="stop" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="消息推送模板" prop="sendId">
                  <el-select
                    v-model="taskForm.sendName"
                    clearable
                    placeholder=""
                    style="width: 100%"
                    filterable
                    @change="handleSelectSend"
                  >
                    <el-option
                      v-for="item in sendConfigData"
                      :key="item.sendId"
                      :label="item.sendName"
                      :value="{ value: item.sendId, label: item.sendName }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="任务描述" prop="taskDescription">
                  <el-input v-model="taskForm.taskDescription" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否启用" prop="isOpen">
                  <el-select v-model="taskForm.isOpen" clearable placeholder="" style="width: 100%">
                    <el-option label="启用" :value="0" />
                    <el-option label="停用" :value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="流程查询条件" name="searchConfig">
            <template slot="title">
              <span class="collapse-title">流程查询条件</span>
            </template>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="用户" prop="userId">
                  <el-select
                    v-model="taskForm.userName"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    placeholder=""
                    :remote-method="queryUserInfo"
                    :loading="loadingUserInfo"
                    style="width: 100%"
                    @change="handleSelectUser"
                  >
                    <el-option
                      v-for="item in userInfoData"
                      :key="item.uid"
                      :label="item.label"
                      :value="{
                        value: item.value,
                        label: item.label,
                        uid: item.uid,
                        orgcode: item.orgcode,
                        orgname: item.orgname
                      }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门" prop="departmentId">
                  <el-select
                    v-model="taskForm.departmentName"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    placeholder=""
                    :remote-method="queryOrgInfo"
                    :loading="loadingOrgInfo"
                    style="width: 100%"
                    @change="handleSelectOrg"
                  >
                    <el-option
                      v-for="item in orgInfoData"
                      :key="item.value"
                      :label="item.label"
                      :value="{ value: item.value, label: item.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="开始时间" prop="startTime">
                  <el-date-picker
                    v-model="taskForm.startTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder=""
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间" prop="endTime">
                  <el-date-picker
                    v-model="taskForm.endTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder=""
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="时间段是否随任务频率刷新" prop="customRule">
                  <el-select v-model="taskForm.customRule" placeholder="" style="width: 100%">
                    <el-option label="是" :value="0" />
                    <el-option label="否" :value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" prop="state">
                  <el-select v-model="taskForm.state" clearable placeholder="" style="width: 100%">
                    <el-option v-for="item in STATE" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="流程模板" prop="workflowCode">
                  <el-input v-model="taskForm.workflowCode" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="流程编号" prop="instanceId">
                  <el-input v-model="taskForm.instanceId" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="页数" prop="page">
                  <el-input v-model="taskForm.page" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="条数" prop="size">
                  <el-input v-model="taskForm.size" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="流程返回参数" name="responseConfig">
            <template slot="title">
              <span class="collapse-title">流程返回参数</span>
            </template>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="流水号" prop="instanceSequenceNo">
                  <el-input v-model="taskForm.instanceSequenceNo" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实例名称" prop="instanceName">
                  <el-input v-model="taskForm.instanceName" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="当前审批环节名称" prop="approverLink">
                  <el-input v-model="taskForm.approverLink" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="当前审批人" prop="approver">
                  <el-select
                    v-model="taskForm.approver"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    placeholder=""
                    :remote-method="queryUserInfo"
                    :loading="loadingUserInfo"
                    style="width: 100%"
                    @change="handleSelectUser2"
                  >
                    <el-option
                      v-for="item in userInfoData"
                      :key="item.uid"
                      :label="item.label"
                      :value="{ value: item.value, label: item.value }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="2">
              <el-col :span="12">
                <el-form-item label="流程名称" prop="workflowName">
                  <el-input v-model="taskForm.workflowName" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleCheckout">校 验</el-button>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit, addCheckout } from '@admin/api/execute_task'
import * as ClassTemplate from '@admin/api/class_template'
import * as CodeLibrary from '@admin/api/code_library'
import * as SendConfig from '@admin/api/send_config'
import * as UserInfo from '@admin/api/user_info'
import * as OrgInfo from '@admin/api/org_info'
import { deepClone } from '@/utils'
import { STATE } from '@/constants'

const defaultTaskForm = {
  taskId: '',
  jobGroup: '',
  jobName: '',
  beanClass: '',
  executeId: '',
  jobStatus: '',
  taskDescription: '',
  userId: '',
  departmentId: '',
  startTime: '',
  endTime: '',
  workflowCode: '',
  instanceId: '',
  state: '',
  instanceSequenceNo: '',
  originator: '',
  instanceName: '',
  originatorName: '',
  finishedTime: '',
  createdTime: '',
  workflowName: '',
  originatorOUName: '',
  approver: '',
  receivedTime: '',
  approverLink: '',
  priority: '',
  customRule: '',
  cronExpression: '',
  createTime: '',
  updateTime: '',
  urgeCount: '',
  isOpen: '',
  timeType: '',
  sendId: '',
  sendName: '',
  page: '1',
  size: '100',
  userName: '',
  departmentName: ''
}

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    defaultInfo: {
      type: Object,
      default: () => deepClone(defaultTaskForm)
    },
    getTableData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      STATE,
      activeNames: ['systemConfig', 'searchConfig', 'responseConfig'],
      dialogVisible: false,
      taskForm: deepClone(defaultTaskForm),
      taskFormRules: {
        jobGroup: [{ required: true, message: '请输入任务分组', trigger: 'blur' }],
        jobName: [{ required: true, message: '请输入任务名称描述', trigger: 'blur' }],
        beanClass: [{ required: true, message: '请选择执行方法', trigger: 'change' }],
        executeId: [{ required: true, message: '请输入绑定执行编号', trigger: 'blur' }],
        timeType: [{ required: true, message: '请选择时间类型', trigger: 'change' }],
        cronExpression: [{ required: true, message: '请输入调用cron', trigger: 'blur' }],
        customRule: [{ required: true, message: '请选择时间段是否随任务频率刷新', trigger: 'change' }],
        page: [{ required: true, message: '请输入页数', trigger: 'blur' }],
        size: [{ required: true, message: '请输入条数', trigger: 'blur' }]
      },
      beanClassData: [],
      codeLibraryData: [],
      userInfoData: [],
      loadingUserInfo: false,
      loadingCodeLibrary: false,
      sendConfigData: [],
      orgInfoData: [],
      loadingOrgInfo: false
    }
  },
  watch: {
    defaultInfo: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (newValue) {
        this.taskForm = deepClone(newValue)
      },
      deep: true
    },
    dialogVisible(value) {
      if (value) {
        this.getSendConfigData()
        this.getCodeLibraryData()
        this.getBeanClassData()
        if (!this.isEdit) {
          this.taskForm.executeId = new Date().getTime()
        }
      }
    }
  },
  methods: {
    async queryOrgInfo(queryStr) {
      if (queryStr !== '') {
        this.loadingOrgInfo = true
        try {
          const results = await OrgInfo.queryByPage({ page: 1, size: 99999 }, { name: queryStr })
          const options = []
          ;(results.content || []).forEach(item => {
            options.push({ value: item.orgcode, label: item.name })
          })
          this.orgInfoData = options
          this.loadingOrgInfo = false
        } catch (error) {
          this.orgInfoData = []
          this.loadingOrgInfo = false
        }
      } else {
        this.orgInfoData = []
      }
    },
    handleSelectOrg(item) {
      const { label, value } = item
      this.taskForm.departmentName = label
      this.taskForm.departmentId = value
    },
    async queryUserInfo(queryStr) {
      if (queryStr !== '') {
        this.loadingUserInfo = true
        try {
          const results = await UserInfo.queryByPage({ page: 1, size: 99999 }, { name: queryStr })
          const options = []
          ;(results.content || []).forEach(item => {
            const { name, uid, orgcode, orgname } = item
            options.push({ value: name, label: `${name}_${orgname}_${uid}`, uid, orgcode, orgname })
          })
          this.userInfoData = options
          this.loadingUserInfo = false
        } catch (error) {
          this.userInfoData = []
          this.loadingUserInfo = false
        }
      } else {
        this.userInfoData = []
      }
    },
    handleSelectUser(item) {
      const { value, uid, orgcode, orgname } = item
      this.taskForm.userName = value
      this.taskForm.userId = uid
      this.handleSelectOrg({ label: orgname, value: orgcode })
    },
    handleSelectUser2({ value }) {
      this.taskForm.approver = value
    },
    async getCodeLibraryData() {
      const results = await CodeLibrary.queryByPage({ page: 1, size: 99999 }, { codeNo: 'timeType' })
      const { content } = results
      this.codeLibraryData = content || []
    },
    handleSelectCode(item) {
      const { label, value } = item
      this.taskForm.timeType = label
      this.taskForm.cronExpression = value
    },
    handleSelectSend(item) {
      const { label, value } = item
      this.taskForm.sendName = label
      this.taskForm.sendId = value
    },
    async getBeanClassData() {
      const result = await ClassTemplate.queryByPage({ page: 1, size: 99999 }, { isOpen: 0 })
      const { content } = result
      this.beanClassData = content || []
    },
    async getSendConfigData() {
      const result = await SendConfig.queryByPage({ page: 1, size: 99999 })
      const { content } = result
      this.sendConfigData = content || []
    },
    handleCancel() {
      this.dialogVisible = false
      this.taskForm = deepClone(defaultTaskForm)
    },
    handleConfirm() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    async handleCheckout() {
      await addCheckout(this.taskForm)
      this.$modal.msgSuccess('校验通过!')
    },
    async submit() {
      try {
        this.isEdit ? await edit(this.taskForm) : await add(this.taskForm)
        this.handleCancel()
        this.getTableData()
      } catch (error) {
        this.handleCancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collapse-title {
  font-weight: 700;
  font-size: 16px;
  color: #303133;
}
:deep(.el-collapse) {
  border: none;
}
:deep(.el-collapse-item__header) {
  border: none;
}
:deep(.el-collapse-item__wrap) {
  border: none;
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}
</style>
