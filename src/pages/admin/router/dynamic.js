export const dynamicRoutes = [
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
