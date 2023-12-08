import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@mobile/mobile-layout'

export const constantRoutes = [
  {
    path: '/',
    redirect: '/log_info'
  },
  {
    path: '/404',
    component: () => import('@mobile/views/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/log_info',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Log Info',
        component: () => import('@mobile/views/log_info/index'),
        meta: { label: '请求日志', name: 'Log Info', icon: '' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    base: '/mobile/',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
