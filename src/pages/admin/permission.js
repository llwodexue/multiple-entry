import router from '@admin/router'
import store from '@admin/store'
import modal from '@/plugins/modal'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@admin/utils/auth'
import defaultSettings from '@admin/settings'

const isDeBugger = process.env.NODE_ENV === 'development' && defaultSettings.isDeBugger

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
    /* 有 token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完 user_info 信息
        store
          .dispatch('GetInfo')
          .then(userInfo => {
            store.dispatch('GenerateRoutes', userInfo.roles).then(accessRoutes => {
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
          })
          .catch(err => {
            store.dispatch('LogOut').then(() => {
              modal.msgError(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      if (isDeBugger) {
        if (store.getters.roles.length === 0) {
          // 判断当前用户是否已拉取完 user_info 信息
          store
            .dispatch('GetInfo')
            .then(userInfo => {
              store.dispatch('GenerateRoutes', userInfo.roles).then(accessRoutes => {
                router.addRoutes(accessRoutes) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              })
            })
            .catch(err => {
              store.dispatch('LogOut').then(() => {
                modal.msgError(err)
                next({ path: '/' })
              })
            })
        } else {
          next()
        }
      } else {
        next(`/login`)
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
