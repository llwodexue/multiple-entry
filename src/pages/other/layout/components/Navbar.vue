<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb v-if="!topNav" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <div class="right-menu-item hover-effect" @click="onSearchClick">
          <i class="el-icon-search" title="菜单搜索" />
        </div>
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <span class="user-name">{{ name }}</span>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="newPassVisible = true">
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <Search ref="searchRef" />

    <el-dialog :visible.sync="newPassVisible" :close-on-click-modal="false" title="修改密码" append-to-body width="500px">
      <el-form
        ref="newPassRef"
        :rules="newPassRules"
        :model="newPassForm"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left: 30px"
      >
        <el-form-item label="原密码" prop="srcPassword">
          <el-input v-model="newPassForm.srcPassword" placeholder="请输入原密码" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="newPassForm.newPassword" placeholder="请输入新密码" type="password" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="rePassword">
          <el-input v-model="newPassForm.rePassword" placeholder="请输入确认新密码" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="newPassVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changePwd } from '@other/api/login'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@other/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Search from './Search'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    Search
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.newPassForm.newPassword) {
        callback(new Error('两次新密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      newPassVisible: false,
      newPassForm: {
        srcPassword: '',
        newPassword: '',
        rePassword: ''
      },
      newPassRules: {
        srcPassword: [{ required: true, message: '请输入原密码', trigger: 'change' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'change' }],
        rePassword: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'name']),
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    onSearchClick() {
      this.$refs.searchRef.openSearch()
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$modal
        .confirm('确定注销并退出系统吗？')
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            this.$router.push({ path: '/login' })
          })
        })
        .catch(() => {})
    },
    submitForm() {
      this.$refs['newPassRef'].validate(valid => {
        if (valid) {
          changePwd({ srcPassword: this.newPassForm.srcPassword, newPassword: this.newPassForm.newPassword }).then(res => {
            if (res.code === 200) {
              this.$modal.msgSuccess('密码修改成功')
              this.newPassVisible = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.user-name {
  margin: 0 10px;
  font-size: 14px;
}
</style>
