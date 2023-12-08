<template>
  <div class="user_info">
    <div class="custom-search">
      <el-form ref="form" :model="form" label-width="90px">
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="用户中心登录名">
              <el-input v-model="form.uid" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户姓名">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户中心组织名称">
              <el-input v-model="form.orgname" />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display: flex; justify-content: center">
            <el-button plain @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="custom-table">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column align="center" prop="uid" label="用户中心登录名" width="120" />
        <el-table-column align="center" prop="name" label="用户姓名" />
        <el-table-column align="center" prop="personid" label="用户编码" show-overflow-tooltip />
        <el-table-column align="center" prop="employeecode" label="员工号" width="120" />
        <el-table-column align="center" prop="orgcode" label="用户中心组织编码" width="110" />
        <el-table-column align="center" prop="orgname" label="用户中心组织名称" width="110" />
        <el-table-column align="center" prop="status" label="状态" />
        <el-table-column align="center" prop="pinyin" label="全拼" />
        <el-table-column align="center" prop="sex" label="性别" />
        <el-table-column align="center" prop="email" label="邮箱" />
        <el-table-column align="center" prop="usertype" label="用户类型" />
        <el-table-column align="center" prop="phone" label="座机" />
        <el-table-column align="center" prop="orders" label="排序" />
        <el-table-column align="center" prop="begindate" label="入职日期" />
        <el-table-column align="center" prop="validate" label="有效期" />
        <el-table-column align="center" prop="workloc" label="工位" />
        <el-table-column align="center" prop="wecharid" label="企业微信userid" />
        <el-table-column align="center" prop="jobrank" label="职级" />
        <el-table-column align="center" prop="userroom" label="房号" />
        <el-table-column align="center" prop="directphone" label="直拨号" />
        <el-table-column align="center" prop="mainjobcode" label="所在部门主要职务编码" />
        <el-table-column align="center" prop="createtime" label="创建时间" />
        <el-table-column align="center" prop="modifytime" label="修改时间" />
        <el-table-column align="center" prop="ext1" label="扩展字段1" />
        <el-table-column align="center" prop="ext2" label="扩展字段2" />
        <el-table-column align="center" prop="ext3" label="扩展字段3" />
        <el-table-column align="center" prop="ext4" label="扩展字段4" />
        <el-table-column align="center" prop="ext5" label="扩展字段5" />
        <el-table-column align="center" prop="role" label="角色" />
        <el-table-column align="center" prop="img" label="头像地址" />
        <!-- <el-table-column fixed="right" align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)">详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="custom-table-pagination" style="text-align: right">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 30, 50]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </div>
    </div>
    <DetailsModal ref="detailsModalRef" :default-info="templateForm" />
  </div>
</template>

<script>
import { queryByPage } from '@admin/api/user_info'
import DetailsModal from './components/DetailsModal'
import { deepClone } from '@/utils'

const defaultForm = {
  uid: '',
  name: '',
  orgname: ''
}

export default {
  components: {
    DetailsModal
  },
  data() {
    return {
      form: deepClone(defaultForm),
      tableData: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      templateForm: {}
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.loading = true
      try {
        const result = await queryByPage({ page: this.page, size: this.size }, this.form)
        const { content, totalElements } = result
        this.tableData = content
        this.total = totalElements
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    handleReset() {
      this.form = deepClone(defaultForm)
      this.getTableData()
    },
    handleSearch() {
      this.getTableData()
    },
    handleView(row) {
      this.$refs.detailsModalRef.dialogVisible = true
      this.templateForm = { ...row }
    },
    handleSizeChange(size) {
      this.size = size
      this.getTableData()
    },
    handleCurrentPageChange(page) {
      this.page = page
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
