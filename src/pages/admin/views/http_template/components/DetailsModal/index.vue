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
      <el-descriptions :column="2">
        <el-descriptions-item label="模板编号">{{ descriptions.templateId }}</el-descriptions-item>
        <el-descriptions-item label="模板名称">
          {{ descriptions.templateName }}
        </el-descriptions-item>
        <el-descriptions-item label="模板类型">
          {{ selectEchoDic(TEMPLATE_TYPE, descriptions.templateType) }}
        </el-descriptions-item>
        <el-descriptions-item label="请求方式">{{ descriptions.requestType }}</el-descriptions-item>
        <el-descriptions-item label="参数来源">{{ descriptions.paramId }}</el-descriptions-item>
        <el-descriptions-item label="请求成功字段">
          {{ descriptions.successParam }}
        </el-descriptions-item>
        <el-descriptions-item label="请求成功编码">
          {{ descriptions.successCode }}
        </el-descriptions-item>
        <el-descriptions-item label="请求头来源">{{ descriptions.className }}</el-descriptions-item>
        <el-descriptions-item label="请求头码值">
          {{ descriptions.methodName }}
        </el-descriptions-item>
        <el-descriptions-item label="排序号">{{ descriptions.sortNo }}</el-descriptions-item>
        <el-descriptions-item label="是否启用">
          {{ ['启用', '停用'][descriptions.isOpen] }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1">
        <el-descriptions-item label="请求Json模板">
          {{ descriptions.jsonTemplate }}
        </el-descriptions-item>
        <el-descriptions-item label="url模板">{{ descriptions.urlTemplate }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ descriptions.remark }}</el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { TEMPLATE_TYPE } from '@/constants'

const defaultDescriptions = {
  templateId: '',
  templateName: '',
  templateType: '',
  requestType: '',
  paramId: '',
  jsonTemplate: '',
  urlTemplate: '',
  successParam: '',
  successCode: '',
  className: '',
  methodName: '',
  sortNo: '',
  remark: '',
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
      TEMPLATE_TYPE,
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
