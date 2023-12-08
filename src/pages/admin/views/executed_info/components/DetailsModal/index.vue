<template>
  <div class="custom-dialog">
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      destroy-on-close
      width="40%"
    >
      <el-descriptions :column="1">
        <el-descriptions-item label="已执行流程编号">
          {{ descriptions.executedId }}
        </el-descriptions-item>
        <el-descriptions-item label="关联任务">
          {{ descriptions.taskId }}
        </el-descriptions-item>
        <el-descriptions-item label="流程编号">
          {{ descriptions.instanceId }}
        </el-descriptions-item>
        <el-descriptions-item label="已执行流程类型">
          {{ descriptions.executedType }}
        </el-descriptions-item>
        <el-descriptions-item label="执行结果状态">
          {{ descriptions.executedCode }}
        </el-descriptions-item>
        <el-descriptions-item label="流程名称">
          {{ descriptions.workflowName }}
        </el-descriptions-item>
        <el-descriptions-item label="流程流水号">
          {{ descriptions.sequenceNo }}
        </el-descriptions-item>
        <el-descriptions-item label="流程类型">
          {{ descriptions.schemaCode }}
        </el-descriptions-item>
        <el-descriptions-item label="流程发起人">
          {{ descriptions.originator }}
        </el-descriptions-item>
        <el-descriptions-item label="流程发起时间">
          {{ descriptions.startDate }}
        </el-descriptions-item>
        <el-descriptions-item label="任务执行时流程状态">
          {{ descriptions.state }}
        </el-descriptions-item>
        <el-descriptions-item label="执行结果详情">
          {{ descriptions.executedMsg }}
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'

const defaultDescriptions = {
  executedId: '',
  executedType: '',
  executedCode: '',
  executedMsg: '',
  instanceId: '',
  workflowName: '',
  taskId: '',
  sequenceNo: '',
  schemaCode: '',
  originator: '',
  startDate: '',
  state: ''
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
