export const dynamicRoutes = [
  {
    name: 'Template',
    path: '/template',
    hidden: false,
    redirect: 'noRedirect',
    component: 'ParentView',
    alwaysShow: true,
    meta: { title: '核心票务模块', icon: 't-jp', noCache: false },
    children: [
      {
        name: 'ExampleVue',
        path: 'example-vue',
        hidden: false,
        redirect: 'noRedirect',
        component: 'layout',
        alwaysShow: true,
        meta: { title: '示例页面', icon: 't-jp', noCache: false },
        children: [
          {
            name: 'VuePage',
            path: 'vue-page',
            hidden: false,
            component: 'template/example-vue/vue-page/index',
            meta: { title: 'setup语法糖示例页面', icon: 'list', noCache: false }
          },
          {
            name: 'JsxPage',
            path: 'jsx-page',
            hidden: false,
            component: 'template/example-vue/jsx-page/index',
            meta: { title: 'jsx语法示例页面', icon: 'list', noCache: false }
          }
        ]
      }
    ]
  }
]
