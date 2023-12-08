<template>
  <div class="custom-dialog">
    <el-dialog
      :title="(isEdit ? '编辑' : '新建') + '配置'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      destroy-on-close
      width="40%"
    >
      <el-form
        ref="templateForm"
        :model="templateForm"
        :rules="templateFormRules"
        label-width="110px"
      >
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="配置描述" prop="initflowName">
              <el-input v-model="templateForm.initflowName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="流程编码" prop="workflowCode">
              <el-input v-model="templateForm.workflowCode" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="是否自动提交" prop="finishStart">
              <el-select v-model="templateForm.finishStart" placeholder="" style="width: 100%">
                <el-option label="是" :value="0" />
                <el-option label="否" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="是否启用" prop="isOpen">
              <el-select v-model="templateForm.isOpen" clearable placeholder="" style="width: 100%">
                <el-option label="启用" :value="0" />
                <el-option label="停用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="发起人姓名" prop="userName">
              <el-select
                v-model="templateForm.userName"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder=""
                :remote-method="queryUserInfo"
                :loading="loadingUserInfo"
                style="width: 100%"
                @change="handleSelectUser"
              >
                <el-option
                  v-for="item in userInfoData"
                  :key="item.label"
                  :label="item.label"
                  :value="{
                    value: item.value,
                    label: item.label,
                    personid: item.personid
                  }"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="参数模板" prop="paramValues">
              <el-input v-model="templateForm.paramValues" type="textarea" :rows="2" />
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
import { add, edit } from '@admin/api/initflow_config'
import * as UserInfo from '@admin/api/user_info'
import { deepClone } from '@/utils'

const defaultTemplateForm = {
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
      templateFormRules: {
        initflowName: [{ required: true, message: '请输入配置描述', trigger: 'blur' }],
        workflowCode: [{ required: true, message: '请输入流程编码', trigger: 'blur' }],
        finishStart: [{ required: true, message: '请选择是否自动提交', trigger: 'change' }],
        isOpen: [{ required: true, message: '请选择是否启用', trigger: 'change' }],
        userName: [{ required: true, message: '请选择发起人姓名', trigger: 'change' }]
      },
      userInfoData: [],
      loadingUserInfo: false
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
    async queryUserInfo(queryStr) {
      if (queryStr !== '') {
        this.loadingUserInfo = true
        try {
          const results = await UserInfo.queryByPage({ page: 1, size: 99999 }, { name: queryStr })
          const options = []
          ;(results.content || []).forEach(item => {
            const { name, uid, personid, orgname } = item
            options.push({ value: name, label: `${name}_${orgname}_${uid}`, personid })
          })
          this.userInfoData = options
          this.loadingUserInfo = false
        } catch (error) {
          this.userInfoData = []
          this.loadingUserInfo = false
        }
      } else {
        this.userInfoData = []
      }
    },
    handleSelectUser(item) {
      const { value, personid } = item
      this.templateForm.userName = value
      this.templateForm.userId = personid
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
