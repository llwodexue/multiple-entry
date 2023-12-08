import Layout from '@other/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: resolve => require(['@other/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: resolve => require(['@other/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: resolve => require(['@other/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: resolve => require(['@other/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: resolve => require(['@other/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]
