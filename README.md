项目构建
----

### 环境和依赖

- [Node](http://nodejs.cn/) —— 环境安装
- [Element-ui](https://element.eleme.cn/#/zh-CN/component/installation) —— 前端 UI 框架
- [Vue](https://cn.vuejs.org/) —— 前端MVVM框架
- [VueCli](https://cli.vuejs.org/zh/) —— 脚手架
- [VueRouter](https://router.vuejs.org/zh/) —— 路由
- [Vuex](https://vuex.vuejs.org/zh/guide/) —— 状态管理
- [Webpack](https://www.webpackjs.com/) —— 打包工具
- [Sass](https://www.sass.hk/) —— CSS 预处理器

### 运行和安装

- ##### 安装依赖
```bash
npm install
```
- ##### 运行项目
```bash
npm run serve
```
-  ##### 项目打包命令
```bash
npm run build:prod
```
- **后端测试接口服务相关配置**

  如后端设置反向代理或 CORS 白名单，解决开发环境的跨域问题，**需要修改** `vue.config.js`（基本上都是整个项目的最后一个文件）

  将开发环境配置文件的 `VUE_APP_BASE_API` 设置为空（本项目已经处理，可忽略）

  找到 `devServer > proxy > target: '实际接口请求地址'` 进行修改

```js
module.exports = {
  // ...
  devServer: {
    // ...
    proxy: {
      '/jp': {
        target: 'http://192.168.1.241:8080/afc', // !!!修改为实地址即可
        changeOrigin: true,
        pathRewrite: {
          '/jp': '/'
        }
      },
      '/yp': {
        target: 'http://192.168.1.241:8080/afcsm', // !!!修改为实地址即可
        changeOrigin: true,
        pathRewrite: {
          '/yp': '/'
        }
      }
    },
  },
}
```

### 目录结构

现项目将 `src` 下文件（除 `styles`）分别放入 `pages\jp` 和 `pages\yp` 文件夹中，其他结构不变

```js
|-- build                         // 项目打包配置项
|-- mock                          // 项目模拟接口数据
|-- node_modules                  // 项目依赖包
|-- public                        // 项目公共文件
|    |-- img                      // index.html所用图片
|    |-- lang                     // 国际化配置文件（在这里修改页面文字）
|    |-- config.js                // 生产环境接口、显示语言、接口是否加解密
|    |-- index.html               // 项目入口
|    |-- langConfig.js            // 国际化页面（表格）映射表
|    |-- menuConfig.js            // 渲染index.html页面逻辑
|-- src                           // 项目根目录
|    |-- api                      // 接口请求
|    |-- assets                   // 静态资源
|    |-- components               // 通用组件（通常不包含业务组件）
|         |-- Pagination          // 分页组件
|         |-- layout              // 页面布局（全局框架，也可能放在src下)
|         |-- Popup               // 模态框组件
|         |-- Screenfull          // 全屏组件
|         |-- SelectTree          // 树形多选框组件
|         |-- SizeSelect          // UI尺寸选择组件
|    |-- directive                // 自定义指令
|         |-- el-drag-dialog      // 模态框拖动指令
|         |-- permission          // 权限控制指令
|         |-- waves               // 按钮点击波纹效果
|    |-- filters                  // 自定义过滤器
|    |-- icons                    // 图标组件svg
|    |-- lang                     // 国际化
|    |-- router                   // 路由配置
|    |-- store                    // 状态管理
|    |-- mixins                   // 混入组件
|         |-- auto-height         // 自动设置table和tree高度
|    |-- styles                   // 公共样式scss
|    |-- utils                    // 通用工具库
|         |-- auth.js             // token存取
|         |-- permission.js       // 权限检查
|         |-- get-page-title.js   // 获取页面标题
|         |-- request.js          // axios请求封装
|         |-- index.js            // 工具方法
|    |-- views                    // 业务页面
|    |-- viewsComponents          // 单独的业务组件
|    |-- App.vue                  // 全局入口组件
|    |-- main.js                  // 全局入口文件
|    |-- permission.js            // 权限校验
|    |-- settings.js              // 全局配置参数
|-- env.development               // 开发环境配置
|-- env.production                // 生产环境配置
|-- env.staging                   // 预发布环境
|-- package.json                  // 项目所需要各种模块及项目的配置信息
|-- package-lock.json             // 记录当前项目实际安装的各个包版本
|-- postcss.config.js             // CSS兼容
|-- README.md                     // 说明文档
|-- vue.config.js                 // vue配置文件
```

开发步骤
----
### 使用前端路由（权限校验）

`src\settings.js` 配置 `isDebugger`，当其为 `true` 时开启本地调试模式

- 页面级：直接获取前端路由（`src\router\asyncRouter.js`），不必请求后端路由权限
- 按钮级：不删除没有权限的按钮

其他 `settings.js` 配置用法可以参考：[路由和侧边栏](https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E9%85%8D%E7%BD%AE%E9%A1%B9)

### 路由配置

**路由分类：**

- staticRouter（ `src\router\staticRouter.js`）：静态路由，不需要动态判断权限的路由，如登录页、404、等通用页面

- asyncRouter（`src\router\asyncRouter.js`）：动态路由，需求动态判断权限并通过 `addRoutes` 动态添加的页面。`isDebugger` 模式下默认获取此文件所有菜单权限

  **注意：** 这里所有 `url`、`name` 都必须唯一。`path` 所有一级路由都以 `/` 开头，以 `/` 开头的嵌套路径会被当作根路径，其余路由不可以 `/` 开头

部署生产环境之前，请在菜单管理中配置好新创建的路由菜单，创建好菜单即可看到对应路由

```js
[
  {
    path: '/system',
    name: '/system',
    meta: { title: '系统管理', icon: 'home' },
    component: () => import('@/components/layout'),
    children: [
      {
        path: 'system-menu',
        name: 'system-menu',
        meta: { title: '菜单管理', icon: 'home' },
        component: () => import('@/views/system/system-menu')
      }
  }
]
```

### 登录权限校验 TODO

> 先说一下 `vue-element-admin` 里权限校验逻辑：

访问 `/xxx`，从 Cookie 中获取 `Token`，判断 `Token` 是否存在

- 如果 `Token` 存在，判断是否为 `/login`
  - 如果是 `/login` 重定向到 `/`
  - 如果不是，获取用户角色动态生成路由（`replace` 模式访问路由 `/xxx`）
- 如果 `Token` 不存在，判断是否在白名单中
  - 如果在白名单中，访问路由 `/xxx`
  - 不再白名单，访问 `/login`

> 国内检票系统权限校验逻辑：（需要优化）

访问 `/xxx`，判断是否是 `/login`

- 如果不是 `/login`，判断是否有 `Token`

  - 有 `Token` 判断是否是 `/yjpage` ，是则打回 `from`，否则继续访问 `/xxx`

  - 没有 `Token` ，判断是否是 `debugger` 状态

    - 是 `debugger` 状态，则继续访问 `/xxx`

    - 不是 `debugger` 状态，判断是否是 `/yjlogin`

      - 是则访问 `/yjlogin`
      - 不是则判断是否有 `cookie`
        - 有 `cookie` 则可以访问 `/yjpage`，但无法访问检票页面
        - 没有 `cookie` 则重新加载路由，更新用户信息（`/getUserInfo`）

      不是 `debugger` 状态还需要判断是否在白名单里

## 命名规范

- 所有组件 `Components` 使用大写开头（`PascalCase`）命名规范，但除了 `index.vue`

  `@/components/BackToTop/index.vue`

- 所有 `.js` 都是用横线连接（`kebab-case` ）

  `@/utils/open-window.js`

- 在 `src/views` 中，代表路由的 `.vue` 文件都是用横线连接（`kebab-case` ）

  `@/views/svg-icons/index.vue`

横线连接（`kebab-case` ）的好处：

- 都是小写，解决浏览器 `url` 对大小写不敏感

### 新建页面

- 全局 `src\components` 只会写一些全局的组件，每个页面写在 `views` 下面，特定业务组件写在 `viewsComponents` 下面
- 全局 `src\styles` 放置全局公用的样式，每一个页面的样式就写在 `xx.vue` 最下面，请记住加上 `scoped` 或者命名空间，避免造成全局的样式污染

```html
<template>
  <!-- 每个template标签内只能有一个父元素 -->
  <div>
    <!-- 使用组件时，大写字母处断开，转换为小写，并用'-'连接 -->
    <svg-icon icon-class="fullscreen" />
    <span>{{text}}</span>
    <button @click="ceshi">点我触发click事件</buttom>
  </div>
</template>
<script>
// 引入需要使用的组件
import SvgIcon from '@/components/SvgIcon'
export default {
  // 定义组件名
  name: 'SystemMenu',
  // 需要使用的组件
  components: {
    IconBtn
  },
  // 数据改变，视图层自动做出相应变化
  data () {
    return {
      text: 'ceshi'
    }
  },
  // 函数方法
  methods: {
    ceshi () {
      this.text = '我改变了'
    }
  }
}
</script>

<style lang="scss" scoped>
/* css区域，项目默认使用scss预处理器，也可以直接使用css */
</style>
```

### 新建 API（接口地址）

完成路由页面的创建后，最后在 `src\api` 文件夹下创建本模块对应的 API 服务

```js
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}
```

**接口服务相关配置**

- 开发环境：`.env.development` 下的 `VUE_APP_BASE_API`（可以设置多个 `baseURL`）

  **注意：** 环境变量必须以 `VUE_APP_` 开头

- 生产环境：`public\config.js` 下的 `indexConfig.baseApi`（Jp 为检票，Yp 为验票）

如后端设置反向代理或 CORS 白名单，解决开发环境的跨域问题，需要修改 `vue.config.js`，并将开发环境配置文件的 `VUE_APP_BASE_API` 设置为空

- `devServer > proxy > target: '实际接口请求地址'`

```js
module.exports = {
  // ...
  devServer: {
    // ...
    proxy: {
      '/jp': {
        target: 'http://192.168.1.241:8080/afc',
        changeOrigin: true,
        pathRewrite: {
          '/jp': '/'
        }
      }
    },
  },
}
```

## Webpack

当项目开发完毕，只需要运行一行命令就可以打包你的应用：

```bash
# 打包正式环境
npm run build:prod

# 打包预发布环境
npm run build:stage
```

打包优化细节待补充