exports.AdminRoutes = [
  {
    name: 'ExampleVue',
    path: '/example-vue',
    hidden: false,
    redirect: '/example-vue/setup-page',
    component: 'layout',
    alwaysShow: true,
    meta: { title: '示例页面', icon: 't-system', noCache: false },
    children: [
      {
        name: 'SetupPage',
        path: 'setup-page',
        hidden: false,
        component: 'template/example-vue/setup-page/index',
        meta: { title: '组合式API示例页面', icon: 'list', noCache: false }
      },
      {
        name: 'OptionsPage',
        path: 'options-page',
        hidden: false,
        component: 'template/example-vue/options-page/index',
        meta: { title: '选项式API示例页面', icon: 'list', noCache: false }
      }
    ]
  }
]
exports.OtherRoutes = [
  {
    name: 'Template',
    path: '/template',
    hidden: false,
    redirect: '/template/example-vue',
    component: 'ParentView',
    alwaysShow: true,
    meta: { title: '快速指南', icon: 't-system', noCache: false },
    children: [
      {
        name: 'ExampleVue',
        path: 'example-vue',
        hidden: false,
        redirect: '/template/example-vue/setup-page',
        component: 'layout',
        alwaysShow: true,
        meta: { title: '示例页面', icon: 't-system', noCache: false },
        children: [
          {
            name: 'SetupPage',
            path: 'setup-page',
            hidden: false,
            component: 'template/example-vue/setup-page/index',
            meta: { title: '组合式API示例页面', icon: 'list', noCache: false }
          },
          {
            name: 'OptionsPage',
            path: 'options-page',
            hidden: false,
            component: 'template/example-vue/options-page/index',
            meta: { title: '选项式API示例页面', icon: 'list', noCache: false }
          }
        ]
      }
    ]
  }
]
