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
      <el-descriptions :column="2">
        <el-descriptions-item label="用户中心登录名">{{ descriptions.uid }}</el-descriptions-item>
        <el-descriptions-item label="用户姓名">{{ descriptions.name }}</el-descriptions-item>
        <el-descriptions-item label="用户编码">{{ descriptions.personid }}</el-descriptions-item>
        <el-descriptions-item label="员工号">{{ descriptions.employeecode }}</el-descriptions-item>
        <el-descriptions-item label="用户中心组织编码">{{ descriptions.orgcode }}</el-descriptions-item>
        <el-descriptions-item label="用户中心组织名称">{{ descriptions.orgname }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ descriptions.status }}</el-descriptions-item>
        <el-descriptions-item label="全拼">{{ descriptions.pinyin }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ descriptions.sex }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ descriptions.email }}</el-descriptions-item>
        <el-descriptions-item label="用户类型">{{ descriptions.usertype }}</el-descriptions-item>
        <el-descriptions-item label="座机">{{ descriptions.phone }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ descriptions.orders }}</el-descriptions-item>
        <el-descriptions-item label="入职日期">{{ descriptions.begindate }}</el-descriptions-item>
        <el-descriptions-item label="有效期">{{ descriptions.validate }}</el-descriptions-item>
        <el-descriptions-item label="工位">{{ descriptions.workloc }}</el-descriptions-item>
        <el-descriptions-item label="企业微信userid">{{ descriptions.wecharid }}</el-descriptions-item>
        <el-descriptions-item label="职级">{{ descriptions.jobrank }}</el-descriptions-item>
        <el-descriptions-item label="房号">{{ descriptions.userroom }}</el-descriptions-item>
        <el-descriptions-item label="直拨号">{{ descriptions.directphone }}</el-descriptions-item>
        <el-descriptions-item label="所在部门主要职务编码">{{ descriptions.mainjobcode }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ descriptions.createtime }}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{ descriptions.modifytime }}</el-descriptions-item>
        <el-descriptions-item label="扩展字段1">{{ descriptions.ext1 }}</el-descriptions-item>
        <el-descriptions-item label="扩展字段2">{{ descriptions.ext2 }}</el-descriptions-item>
        <el-descriptions-item label="扩展字段3">{{ descriptions.ext3 }}</el-descriptions-item>
        <el-descriptions-item label="扩展字段4">{{ descriptions.ext4 }}</el-descriptions-item>
        <el-descriptions-item label="扩展字段5">{{ descriptions.ext5 }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ descriptions.role }}</el-descriptions-item>
        <el-descriptions-item label="头像地址">{{ descriptions.img }}</el-descriptions-item>
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
  uid: '',
  name: '',
  personid: '',
  employeecode: '',
  orgcode: '',
  orgname: '',
  status: '',
  pinyin: '',
  sex: '',
  email: '',
  usertype: '',
  phone: '',
  orders: '',
  begindate: '',
  validate: '',
  workloc: '',
  wecharid: '',
  jobrank: '',
  userroom: '',
  directphone: '',
  mainjobcode: '',
  createtime: '',
  modifytime: '',
  ext1: '',
  ext2: '',
  ext3: '',
  ext4: '',
  ext5: '',
  role: '',
  img: ''
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
