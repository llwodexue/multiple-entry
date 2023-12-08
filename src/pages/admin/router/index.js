import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@admin/layout'

export const constantRoutes = [
  {
    path: '/',
    redirect: '/execute_task'
  },
  {
    path: '/404',
    component: () => import('@admin/views/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/execute_task',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Execute Task',
        component: () => import('@admin/views/execute_task/index'),
        meta: { title: '执行任务管理', icon: 'el-icon-coordinate' }
      }
    ]
  },
  {
    path: '/http_template',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Http Template',
        component: () => import('@admin/views/http_template/index'),
        meta: { title: '请求模板管理', icon: 'el-icon-receiving' }
      }
    ]
  },
  {
    path: '/class_template',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Class Template',
        component: () => import('@admin/views/class_template/index'),
        meta: { title: '类加载模板管理', icon: 'el-icon-files' }
      }
    ]
  },
  {
    path: '/code_library',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Code Library',
        component: () => import('@admin/views/code_library/index'),
        meta: { title: '码值管理', icon: 'el-icon-coin' }
      }
    ]
  },
  {
    path: '/send_config',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Send Config',
        component: () => import('@admin/views/send_config/index'),
        meta: { title: '消息推送模板管理', icon: 'el-icon-chat-line-square' }
      }
    ]
  },
  {
    path: '/initflow_config',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Initflow Config',
        component: () => import('@admin/views/initflow_config/index'),
        meta: { title: '初始化流程配置', icon: 'el-icon-set-up' }
      }
    ]
  },
  {
    path: '/executed_info',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Executed Info',
        component: () => import('@admin/views/executed_info/index'),
        meta: { title: '已执行流程列表', icon: 'el-icon-finished' }
      }
    ]
  },
  /* {
    path: '/user_info',
    component: Layout,
    children: [
      {
        path: '',
        name: 'User Info',
        component: () => import('@admin/views/user_info/index'),
        meta: { title: '用户列表', icon: 'el-icon-user' }
      }
    ]
  }, */
  {
    path: '/system-log',
    component: Layout,
    meta: { title: '系统日志', icon: 'el-icon-date' },
    children: [
      {
        path: '/log_info',
        name: 'Log Info',
        component: () => import('@admin/views/log_info/index'),
        meta: { title: '请求日志', icon: '' }
      },
      {
        path: '/send_log',
        name: 'Send Log',
        component: () => import('@admin/views/send_log/index'),
        meta: { title: '消息推送日志', icon: '' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: (to) => {
      if (to.path.includes(';jsessionid=')) return to.path.split(';jsessionid=')[0]
      return '/404'
    },
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    base: '/admin/',
    // base: '/index/',
    // base: '',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
