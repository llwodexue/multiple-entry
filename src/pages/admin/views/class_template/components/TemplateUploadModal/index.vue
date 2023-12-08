<template>
  <div class="custom-dialog">
    <el-dialog
      title="新建类加载模板"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      destroy-on-close
      width="40%"
    >
      <el-form ref="templateForm" :model="templateForm" :rules="templateFormRules" label-width="120px">
        <el-row :gutter="2">
          <el-col :span="18">
            <el-form-item label="全类名" prop="className">
              <el-input v-model="templateForm.className" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="18">
            <el-form-item label="类加载类型" prop="classType">
              <el-select v-model="templateForm.classType" placeholder="" style="width: 100%">
                <el-option v-for="item in CLASS_TYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="18">
            <el-form-item label="class文件">
              <el-upload
                ref="uploadRef"
                class="upload"
                action=""
                accept=".class"
                :limit="1"
                :on-exceed="handleExceed"
                :auto-upload="false"
                :multiple="false"
                :http-request="uploadFile"
                :show-file-list="true"
                :on-preview="handlePreview"
                :before-remove="beforeRemove"
              >
                <el-button slot="trigger" type="">选取文件</el-button>
              </el-upload>
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
import { uploadClass } from '@admin/api/class_template'
import { deepClone } from '@/utils'
import { CLASS_TYPE } from '@/constants'

const defaultTemplateForm = {
  className: '',
  classType: ''
}

export default {
  props: {
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
      templateFormRules: {
        className: [{ required: true, message: '请输入全类名', trigger: 'blur' }],
        classType: [{ required: true, message: '请输入类加载类型', trigger: 'blur' }]
      },
      file: null
    }
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false
      this.templateForm = deepClone(defaultTemplateForm)
      this.$refs.uploadRef.clearFiles()
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
        this.$refs.uploadRef.submit()
        const formData = new FormData()
        formData.append('className', this.templateForm.className)
        formData.append('classType', this.templateForm.classType)
        formData.append('classFile', this.file)

        await uploadClass(formData)
        this.handleCancel()
        this.getTableData()
      } catch (error) {
        this.handleCancel()
      }
    },
    uploadFile(param) {
      this.file = param.file
    },
    handlePreview(file) {
      const url = URL.createObjectURL(file.raw)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      const event = new MouseEvent('click')
      a.dispatchEvent(event)
      setTimeout(() => {
        document.body.removeChild(a)
      }, 500)
    },
    beforeRemove(file, fileList) {
      return this.$modal.confirm(`确定移除${file.name}？`)
    },
    handleExceed() {
      this.$modal.msgError('文件数量超过限制')
    }
  }
}
</script>

<style lang="scss" scoped></style>
