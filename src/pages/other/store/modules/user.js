import { login, logout, getInfo } from '@other/api/login'
import { setToken, removeToken } from '@other/utils/auth'

const user = {
  state: {
    id: 0, // 用户编号
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            const { data, code, msg } = res
            if (code === 200) {
              setToken(data.token)
              resolve(data)
            } else {
              reject(msg)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            const { data } = res
            const user = data?.operator
            const avatar =
              user.avatar === '' || user.avatar == null ? require('@/assets/images/profile.jpg') : user.avatar

            const roles = data?.menuList
            const name = user?.operatorName
            if (roles) {
              commit('SET_ROLES', roles)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            let permissions = []
            if (data?.buttonList[0] === '*:*:*') {
              permissions = data?.buttonList
            } else {
              permissions = data?.buttonList.map(i => i.url)
            }
            commit('SET_PERMISSIONS', permissions)
            commit('SET_NAME', name)
            commit('SET_AVATAR', avatar)
            // commit('SET_ID', user.id)
            resolve({
              roles: roles,
              name: name,
              permissions: permissions
            })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    clearInfo({ commit, dispatch }) {
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      dispatch('tagsView/delAllViews')
      removeToken()
    },

    // 退出系统
    LogOut({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            dispatch('clearInfo')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    resetToken({ commit, dispatch }) {
      return new Promise(resolve => {
        dispatch('clearInfo')
        resolve()
      })
    }
  }
}

export default user
