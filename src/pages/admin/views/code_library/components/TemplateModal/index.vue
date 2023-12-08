<template>
  <div class="custom-dialog">
    <el-dialog
      :title="(isEdit ? '编辑' : '新建') + '码值'"
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
            <el-form-item label="码值编号" prop="codeNo">
              <el-input v-model="templateForm.codeNo" :disabled="isEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转码编号" prop="itemNo">
              <el-input v-model="templateForm.itemNo" :disabled="isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="转码值" prop="itemName">
              <el-input v-model="templateForm.itemName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号" prop="sortNo">
              <el-input v-model="templateForm.sortNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="参数" prop="itemParam">
              <el-input v-model="templateForm.itemParam" type="textarea" :rows="2" />
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
import { add, edit } from '@admin/api/code_library'
import { deepClone } from '@/utils'

const defaultTemplateForm = {
  codeNo: '',
  itemNo: '',
  itemName: '',
  itemParam: '',
  sortNo: ''
}

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
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
        this.isEdit ? await edit(this.templateForm) : await add(this.templateForm)
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
