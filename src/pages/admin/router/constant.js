import Layout from '@admin/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: resolve => require(['@admin/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: resolve => require(['@admin/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: resolve => require(['@admin/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: resolve => require(['@admin/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: resolve => require(['@admin/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]
