<template>
  <div class="custom-dialog">
    <el-dialog
      title="编辑类加载模板"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      destroy-on-close
      width="60%"
    >
      <el-form
        ref="templateForm"
        :model="templateForm"
        :rules="templateFormRules"
        label-width="120px"
      >
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="全类名" prop="className">
              <el-input v-model="templateForm.className" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类加载类型" prop="classType">
              <el-select v-model="templateForm.classType" placeholder="" style="width: 100%">
                <el-option
                  v-for="item in CLASS_TYPE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="bean名称" prop="beanName">
              <el-input v-model="templateForm.beanName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="isOpen">
              <el-select v-model="templateForm.isOpen" placeholder="" style="width: 100%">
                <el-option label="启用" :value="0" />
                <el-option label="停用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="加载路径" prop="swapPath">
              <el-input v-model="templateForm.swapPath" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绑定路径" prop="controllerPath">
              <el-input v-model="templateForm.controllerPath" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="排序号" prop="sortNo">
              <el-input v-model="templateForm.sortNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="templateForm.remark" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { edit } from '@admin/api/class_template'
import { deepClone } from '@/utils'
import { CLASS_TYPE } from '@/constants'

const defaultTemplateForm = {
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
      default: () => deepClone(defaultTemplateForm)
    },
    getTableData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      CLASS_TYPE,
      dialogVisible: false,
      templateForm: deepClone(defaultTemplateForm),
      templateFormRules: {}
    }
  },
  watch: {
    defaultInfo: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (newValue) {
        this.templateForm = deepClone(newValue)
      },
      deep: true
    }
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false
      this.templateForm = deepClone(defaultTemplateForm)
    },
    handleConfirm() {
      this.$refs.templateForm.validate(valid => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    async submit() {
      try {
        await edit(this.templateForm)
        this.handleCancel()
        this.getTableData()
      } catch (error) {
        this.handleCancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
