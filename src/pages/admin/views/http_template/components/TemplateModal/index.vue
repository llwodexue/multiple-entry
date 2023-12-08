<template>
  <div class="custom-dialog">
    <el-dialog
      :title="(isEdit ? '编辑' : '新建') + '请求模板'"
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
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="templateForm.templateName" />
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
            <el-form-item label="模板类型" prop="templateType">
              <el-select v-model="templateForm.templateType" placeholder="" style="width: 100%">
                <el-option
                  v-for="item in TEMPLATE_TYPE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式" prop="requestType">
              <el-select v-model="templateForm.requestType" placeholder="" style="width: 100%">
                <el-option label="POST" value="POST" />
                <el-option label="GET" value="GET" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="参数来源" prop="paramId">
              <el-select
                v-model="templateForm.paramId"
                clearable
                placeholder=""
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="(item, index) in codeLibraryData"
                  :key="index"
                  :label="item.codeNo"
                  :value="item.codeNo"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求头来源" prop="className">
              <el-input v-model="templateForm.className" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="请求头码值" prop="methodName">
              <el-input v-model="templateForm.methodName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号" prop="sortNo">
              <el-input v-model="templateForm.sortNo" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="请求成功字段" prop="successParam">
              <el-input v-model="templateForm.successParam" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求成功编码" prop="successCode">
              <el-input v-model="templateForm.successCode" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="21">
            <el-form-item label="请求Json模板" prop="jsonTemplate">
              <el-input v-model="templateForm.jsonTemplate" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              :disabled="!templateForm.jsonTemplate"
              style="margin-left: 14px"
              type="success"
              @click="handleJsonFormat"
            >
              格式化
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="url模板" prop="urlTemplate">
              <el-input v-model="templateForm.urlTemplate" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
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
import { add, edit, jsonFormat } from '@admin/api/http_template'
import * as CodeLibrary from '@admin/api/code_library'
import { deepClone } from '@/utils'
import { TEMPLATE_TYPE } from '@/constants'

const defaultTemplateForm = {
  templateId: '',
  templateName: '',
  templateType: '',
  requestType: '',
  paramId: '',
  jsonTemplate: '',
  urlTemplate: '',
  className: '',
  methodName: '',
  sortNo: '',
  remark: '',
  successParam: '',
  successCode: '',
  isOpen: ''
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
    const checkParamId = (rule, value, callback) => {
      const unValue = value === '' || value === undefined || value === null
      if (['fixedUrl', 'fixedJson'].includes(this.templateForm.templateType) && unValue) {
        callback(new Error('请选择参数来源'))
      }
      callback()
    }
    const checkJsonTemplate = (rule, value, callback) => {
      const unValue = value === '' || value === undefined || value === null
      if (['fixedJson', 'dynamicJson'].includes(this.templateForm.templateType) && unValue) {
        callback(new Error('请输入请求Json模板'))
      }
      callback()
    }

    return {
      TEMPLATE_TYPE,
      dialogVisible: false,
      templateForm: deepClone(defaultTemplateForm),
      templateFormRules: {
        templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        templateType: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
        isOpen: [{ required: true, message: '请选择是否启用', trigger: 'change' }],
        requestType: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
        paramId: [{ validator: checkParamId, trigger: 'change' }],
        jsonTemplate: [{ validator: checkJsonTemplate, trigger: 'blur' }],
        successParam: [{ required: true, message: '请输入请求成功字段', trigger: 'blur' }],
        successCode: [{ required: true, message: '请输入请求成功编码', trigger: 'blur' }],
        urlTemplate: [{ required: true, message: '请输入url模板', trigger: 'blur' }]
      },
      codeLibraryData: []
    }
  },
  watch: {
    defaultInfo: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (newValue) {
        this.templateForm = deepClone(newValue)
      },
      deep: true
    },
    dialogVisible(value) {
      if (value) {
        this.getCodeLibraryData()
      }
    }
  },
  methods: {
    async getCodeLibraryData() {
      const result = await CodeLibrary.queryCodeByPage({ page: 1, size: 99999 })
      this.codeLibraryData = result || []
    },
    async handleJsonFormat() {
      const result = await jsonFormat({ json: this.templateForm.jsonTemplate })
      const { json } = result
      if (json) this.templateForm.jsonTemplate = json
    },
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
