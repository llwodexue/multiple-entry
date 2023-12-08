<template>
  <div class="custom-dialog">
    <el-dialog
      :title="(isEdit ? '编辑' : '新建') + '消息推送模板'"
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
            <el-form-item label="消息类型" prop="sendType">
              <el-select
                v-model="templateForm.sendType"
                clearable
                placeholder=""
                style="width: 100%"
              >
                <el-option
                  v-for="item in SEND_TYPE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称" prop="sendName">
              <el-input v-model="templateForm.sendName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="12">
            <el-form-item label="消息推送人" prop="sendUser">
              <el-select
                v-model="sendUserInfo"
                clearable
                multiple
                filterable
                remote
                reserve-keyword
                placeholder=""
                :remote-method="queryUserInfo"
                :loading="loadingUserInfo"
                style="width: 100%"
              >
                <el-option
                  v-for="item in userInfoData"
                  :key="item.value"
                  :label="item.value"
                  :value="{ value: item.value, label: item.label }"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消息推送人姓名" prop="sendUsername">
              <el-select
                v-model="sendUserInfo"
                clearable
                disabled
                multiple
                filterable
                remote
                reserve-keyword
                placeholder=""
                :remote-method="queryUserInfo"
                :loading="loadingUserInfo"
                style="width: 100%"
              >
                <el-option
                  v-for="item in userInfoData"
                  :key="item.value"
                  :label="item.label"
                  :value="{ value: item.value, label: item.label }"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="消息标题" prop="sendTitle">
              <el-input v-model="templateForm.sendTitle" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="消息链接" prop="sendUrl">
              <el-input v-model="templateForm.sendUrl" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="消息模板" prop="sendTemplate">
              <el-input v-model="templateForm.sendTemplate" type="textarea" :rows="4" />
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
import { add, edit } from '@admin/api/send_config'
import * as UserInfo from '@admin/api/user_info'
import { deepClone } from '@/utils'
import { SEND_TYPE } from '@/constants'

const defaultTemplateForm = {
  sendId: '',
  sendType: '',
  sendTitle: '',
  sendTemplate: '',
  sendUser: '',
  sendUsername: '',
  sendUrl: '',
  sendName: ''
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
      SEND_TYPE,
      dialogVisible: false,
      templateForm: deepClone(defaultTemplateForm),
      templateFormRules: {},
      userInfoData: [],
      loadingUserInfo: false,
      sendUserInfo: []
    }
  },
  watch: {
    defaultInfo: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (newValue) {
        this.templateForm = deepClone(newValue)
        const sendUserInfo = []
        const tempData1 = newValue.sendUser ? newValue.sendUser.split(',') : []
        const tempData2 = newValue.sendUsername ? newValue.sendUsername.split(',') : []
        tempData1.forEach((item, index) => {
          sendUserInfo.push({ value: item, label: tempData2[index] })
        })
        this.sendUserInfo = sendUserInfo
        this.userInfoData = [{ value: newValue.sendUser, label: newValue.sendUsername }]
      },
      deep: true
    }
  },
  methods: {
    async queryUserInfo(queryStr) {
      if (queryStr !== '') {
        this.loadingUserInfo = true
        try {
          const results = await UserInfo.queryByPage({ page: 1, size: 99999 }, { uid: queryStr })
          const options = []
          ;(results.content || []).forEach(item => {
            options.push({ value: item.uid, label: item.name })
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
        let sendUser = ''
        let sendUsername = ''
        this.sendUserInfo.forEach(item => {
          sendUser += item.value + ','
          sendUsername += item.label + ','
        })
        sendUser = sendUser.slice(0, sendUser.length - 1)
        sendUsername = sendUsername.slice(0, sendUsername.length - 1)
        this.templateForm.sendUser = sendUser
        this.templateForm.sendUsername = sendUsername
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
