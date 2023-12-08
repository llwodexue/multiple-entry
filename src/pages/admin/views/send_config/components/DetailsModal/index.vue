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
        <el-descriptions-item label="消息推送编号">{{ descriptions.sendId }}</el-descriptions-item>
        <el-descriptions-item label="模板名称">{{ descriptions.sendName }}</el-descriptions-item>
        <el-descriptions-item label="消息类型">{{ descriptions.sendType }}</el-descriptions-item>
        <el-descriptions-item label="消息标题">{{ descriptions.sendTitle }}</el-descriptions-item>
        <el-descriptions-item label="消息推送人">{{ descriptions.sendUser }}</el-descriptions-item>
        <el-descriptions-item label="消息推送人姓名">
          {{ descriptions.sendUsername }}
        </el-descriptions-item>
        <el-descriptions-item label="消息链接">{{ descriptions.sendUrl }}</el-descriptions-item>
        <el-descriptions-item label="消息模板">{{
          descriptions.sendTemplate
        }}</el-descriptions-item>
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
  sendId: '',
  sendType: '',
  sendTitle: '',
  sendTemplate: '',
  sendUrl: '',
  sendUser: '',
  sendUsername: '',
  sendName: ''
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
