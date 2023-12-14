exports.AdminRoutes = [
  {
    name: 'ExampleVue',
    path: '/example-vue',
    hidden: false,
    alwaysShow: true,
    redirect: '/example-vue/setup-page',
    component: 'layout',
    meta: { title: '代码示例', icon: 'system', noCache: false },
    children: [
      {
        name: 'SetupPage',
        path: 'setup-page',
        hidden: false,
        component: 'example-vue/setup-page/index',
        meta: { title: '组合式API示例页面', icon: 'list', noCache: false }
      },
      {
        name: 'OptionsPage',
        path: 'options-page',
        hidden: false,
        component: 'example-vue/options-page/index',
        meta: { title: '选项式API示例页面', icon: 'list', noCache: false }
      }
    ]
  },
  {
    name: 'Menu',
    path: '/menu',
    hidden: false,
    alwaysShow: true,
    redirect: '/menu/menu1',
    component: 'layout',
    meta: { title: '菜单嵌套', icon: 'tree-table', noCache: false },
    children: [
      {
        name: 'Menu1',
        path: 'menu1',
        hidden: false,
        redirect: '/menu/menu1/menu11',
        component: 'ParentView',
        meta: { title: '菜单1', icon: 'menu-1', noCache: false },
        children: [
          {
            name: 'Menu11',
            path: 'menu11',
            hidden: false,
            component: 'menu/menu1/menu11/index',
            meta: { title: '菜单11', icon: 'menu-2', noCache: false }
          },
          {
            name: 'Menu12',
            path: 'menu12',
            hidden: false,
            redirect: '/menu/menu1/menu12/menu121',
            component: 'ParentView',
            meta: { title: '菜单12', icon: 'menu-2', noCache: false },
            children: [
              {
                name: 'Menu121',
                path: 'menu121',
                hidden: false,
                component: 'menu/menu1/menu12/menu121/index',
                meta: { title: '菜单121', icon: 'menu-3', noCache: false }
              },
              {
                name: 'Menu122',
                path: 'menu122',
                hidden: false,
                component: 'menu/menu1/menu12/menu122/index',
                meta: { title: '菜单122', icon: 'menu-3', noCache: false }
              }
            ]
          },
          {
            name: 'Menu13',
            path: 'menu13',
            hidden: false,
            component: 'menu/menu1/menu13/index',
            meta: { title: '菜单13', icon: 'menu-2', noCache: false }
          }
        ]
      },
      {
        name: 'Menu2',
        path: 'menu2',
        hidden: false,
        component: 'menu/menu2/index',
        meta: { title: '菜单2', icon: 'menu-1', noCache: false }
      }
    ]
  }
]
