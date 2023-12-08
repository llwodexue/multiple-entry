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
        <el-descriptions-item label="类加载编号">{{ descriptions.classId }}</el-descriptions-item>
        <el-descriptions-item label="全类名">{{ descriptions.className }}</el-descriptions-item>
        <el-descriptions-item label="类加载类型">
          {{ selectEchoDic(CLASS_TYPE, descriptions.classType) }}
        </el-descriptions-item>
        <el-descriptions-item label="bean名称">{{ descriptions.beanName }}</el-descriptions-item>
        <el-descriptions-item label="加载路径">{{ descriptions.swapPath }}</el-descriptions-item>
        <el-descriptions-item label="绑定路径">
          {{ descriptions.controllerPath }}
        </el-descriptions-item>
        <el-descriptions-item label="排序号">{{ descriptions.sortNo }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ descriptions.remark }}</el-descriptions-item>
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
import { CLASS_TYPE } from '@/constants'

const defaultDescriptions = {
  classId: '',
  className: '',
  classType: '',
  beanName: '',
  swapPath: '',
  controllerPath: '',
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
      CLASS_TYPE,
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
