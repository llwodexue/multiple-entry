<template>
  <div class="custom-dialog">
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      destroy-on-close
      width="50%"
    >
      <el-descriptions :column="2" title="系统配置">
        <el-descriptions-item label="任务编号">{{ descriptions.taskId }}</el-descriptions-item>
        <el-descriptions-item label="任务分组">{{ descriptions.jobGroup }}</el-descriptions-item>
        <el-descriptions-item label="任务名称">{{ descriptions.jobName }}</el-descriptions-item>
        <el-descriptions-item label="执行方法">{{ descriptions.beanClass }}</el-descriptions-item>
        <el-descriptions-item label="绑定执行编号">
          {{ descriptions.executeId }}
        </el-descriptions-item>
        <el-descriptions-item label="调用cron">
          {{ descriptions.cronExpression }}
        </el-descriptions-item>
        <el-descriptions-item label="工作任务状态">
          {{ { normal: '正常', stop: '停止' }[descriptions.jobStatus] }}
        </el-descriptions-item>
        <el-descriptions-item label="是否启用">
          {{ ['启用', '停用'][descriptions.isOpen] }}
        </el-descriptions-item>
        <el-descriptions-item label="时间类型">{{ descriptions.timeType }}</el-descriptions-item>
        <el-descriptions-item label="消息推送模板">{{ descriptions.sendId }}</el-descriptions-item>
        <el-descriptions-item label="任务描述">
          {{ descriptions.taskDescription }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" title="流程查询条件">
        <el-descriptions-item label="用户编号">{{ descriptions.userId }}</el-descriptions-item>
        <el-descriptions-item label="部门编号">
          {{ descriptions.departmentId }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ descriptions.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ descriptions.endTime }}</el-descriptions-item>
        <el-descriptions-item label="流程模板">
          {{ descriptions.workflowCode }}
        </el-descriptions-item>
        <el-descriptions-item label="流程编号">{{ descriptions.instanceId }}</el-descriptions-item>
        <el-descriptions-item label="时间段是否随任务频率刷新">
          {{ ['是', '否'][descriptions.customRule] }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ selectEchoDic(STATE, descriptions.state) }}
        </el-descriptions-item>
        <el-descriptions-item label="页数">{{ descriptions.page }}</el-descriptions-item>
        <el-descriptions-item label="条数">{{ descriptions.size }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" title="流程返回参数">
        <el-descriptions-item label="流水号">
          {{ descriptions.instanceSequenceNo }}
        </el-descriptions-item>
        <el-descriptions-item label="发起人id">{{ descriptions.originator }}</el-descriptions-item>
        <el-descriptions-item label="实例名称">
          {{ descriptions.instanceName }}
        </el-descriptions-item>
        <el-descriptions-item label="发起人姓名">
          {{ descriptions.originatorName }}
        </el-descriptions-item>
        <el-descriptions-item label="完成时间">
          {{ descriptions.finishedTime }}
        </el-descriptions-item>
        <el-descriptions-item label="发起时间">{{ descriptions.createdTime }}</el-descriptions-item>
        <el-descriptions-item label="流程名称">
          {{ descriptions.workflowName }}
        </el-descriptions-item>
        <el-descriptions-item label="发起人所属组织">
          {{ descriptions.originatorOUName }}
        </el-descriptions-item>
        <el-descriptions-item label="当前审批环节名称">
          {{ descriptions.approverLink }}
        </el-descriptions-item>
        <el-descriptions-item label="当前审批人">{{ descriptions.approver }}</el-descriptions-item>
        <el-descriptions-item label="当前审批人接收时间">
          {{ descriptions.receivedTime }}
        </el-descriptions-item>
        <el-descriptions-item label="优先级">{{ descriptions.priority }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ descriptions.createTime ? descriptions.createTime.slice(0, 10) : '' }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ descriptions.updateTime ? descriptions.createTime.slice(0, 10) : '' }}
        </el-descriptions-item>
        <el-descriptions-item label="调用次数">{{ descriptions.urgeCount }}</el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { STATE } from '@/constants'

const defaultDescriptions = {
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
  page: '',
  size: ''
}

export default {
  props: {
    defaultInfo: {
      type: Object,
      default: () => deepClone(defaultDescriptions)
    }
  },
  data() {
    return {
      STATE,
      dialogVisible: false,
      descriptions: deepClone(defaultDescriptions)
    }
  },
  watch: {
    defaultInfo: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (newValue) {
        this.descriptions = deepClone(newValue)
      },
      deep: true
    }
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false
      this.descriptions = deepClone(defaultDescriptions)
    }
  }
}
</script>

<style lang="scss" scoped></style>
