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
        <el-descriptions-item label="编号">{{ descriptions.initflowId }}</el-descriptions-item>
        <el-descriptions-item label="配置描述">{{ descriptions.initflowName }}</el-descriptions-item>
        <el-descriptions-item label="流程编码">{{ descriptions.workflowCode }}</el-descriptions-item>
        <el-descriptions-item label="参数模板">{{ descriptions.paramValues }}</el-descriptions-item>
        <el-descriptions-item label="发起人personId">
          {{ descriptions.userId }}
        </el-descriptions-item>
        <el-descriptions-item label="发起人姓名">
          {{ descriptions.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="是否自动提交">
          {{ ['是', '否'][descriptions.finishStart] }}
        </el-descriptions-item>
        <el-descriptions-item label="是否启用">
          {{ ['启用', '停用'][descriptions.isOpen] }}
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
  initflowId: '',
  initflowName: '',
  workflowCode: '',
  paramValues: '',
  finishStart: '',
  userId: '',
  userName: '',
  isOpen: ''
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
