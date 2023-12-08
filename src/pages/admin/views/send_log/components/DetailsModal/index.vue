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
        <el-descriptions-item label="日志编号">{{ descriptions.logId }}</el-descriptions-item>
        <el-descriptions-item label="消息推送模板编号">
          {{ descriptions.sendId }}
        </el-descriptions-item>
        <el-descriptions-item label="消息类型">{{ descriptions.msgType }}</el-descriptions-item>
        <el-descriptions-item label="发送时间">{{ descriptions.sendTime }}</el-descriptions-item>
        <el-descriptions-item label="消息推送人">{{ descriptions.msgUser }}</el-descriptions-item>
        <el-descriptions-item label="消息推送人姓名">
          {{ descriptions.msgUsername }}
        </el-descriptions-item>
        <el-descriptions-item label="消息推送详情报文">
          {{ descriptions.msgInfo }}
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
  msgType: '',
  msgUser: '',
  msgUsername: '',
  sendTime: '',
  msgInfo: '',
  sendId: ''
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
