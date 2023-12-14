exports.OtherRoutes = [
  {
    name: 'Template',
    path: '/template',
    hidden: false,
    redirect: '/template/example-vue',
    component: 'ParentView',
    alwaysShow: true,
    meta: { title: '快速指南', icon: 'guide', noCache: false },
    children: [
      {
        name: 'ExampleVue',
        path: 'example-vue',
        hidden: false,
        redirect: '/template/example-vue/setup-page',
        component: 'layout',
        alwaysShow: true,
        meta: { title: '代码示例', icon: 'system', noCache: false },
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
