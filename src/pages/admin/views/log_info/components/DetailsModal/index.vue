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
      <el-descriptions :column="2" label-class-name="desc-label">
        <el-descriptions-item label="日志编号">{{ descriptions.logId }}</el-descriptions-item>
        <el-descriptions-item label="日志类型">{{ descriptions.logType }}</el-descriptions-item>
        <el-descriptions-item label="关联请求模板">
          {{ descriptions.templateId }}
        </el-descriptions-item>
        <el-descriptions-item label="关联任务模板">{{ descriptions.taskId }}</el-descriptions-item>
        <el-descriptions-item label="响应状态">{{ descriptions.code }}</el-descriptions-item>
        <el-descriptions-item label="请求方式">{{ descriptions.respType }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" label-class-name="desc-label">
        <el-descriptions-item label="请求参数">{{ descriptions.respParam }}</el-descriptions-item>
        <el-descriptions-item label="响应信息" content-class-name="req-content">
          {{ descriptions.reqParam }}
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
  logId: '',
  logType: '',
  templateId: '',
  taskId: '',
  code: '',
  respType: '',
  respParam: '',
  reqParam: ''
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

<style lang="scss" scoped>
:deep(.req-content) {
  word-break: break-all;
}
</style>
