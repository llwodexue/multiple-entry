# 多入口项目

## 🧭 项目介绍

### 🚀 技术栈

Node —— 环境安装（需要用到 npm 或 pnpm）

- 官网链接：[http://nodejs.cn/](http://nodejs.cn/)

- 介绍：Node.js 是一个开源的、跨平台的 JavaScript 运行时环境

  > Vue-cli5 Drop support of Node.js 8-11 and 13

- 版本要求：Node >= v14，项目推荐使用 Node >= v16.16.0

Element-ui —— 前端 UI 框架

- 官网链接：[https://element.eleme.cn/#/zh-CN](https://element.eleme.cn/#/zh-CN)
- 介绍：一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库
- 版本要求：Element-ui >= 2.13.0，项目推荐使用 v2.15.14 版本

Vue —— 前端 MVVM 框架

- 官网链接：[https://cn.vuejs.org/](https://cn.vuejs.org/)
- 介绍：一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合
- 版本要求：Vue >= 2.7，项目推荐使用 v2.7.14

Vue 生态圈

1. [Vue Router](https://router.vuejs.org/)：vue 官方的路由。它能快速的帮助你构建一个单页面或者多页面的项目
2. [Vuex](https://vuex.vuejs.org/)：专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。它能解决你很多全局状态或者组件之间通信的问题
3. [Vue Loader](https://vue-loader.vuejs.org/)：vue 文件定制的一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件。它能在开发过程中使用热重载来保持状态，为每个组件模拟出 scoped CSS 等等功能。不过大部分情况下你不需要对它直接进行配置，脚手架都帮你封装好了
4. [Vue Dev-Tools](https://github.com/vuejs/vue-devtools)：Vue 在浏览器下的调试工具。写 vue 必备的一个浏览器插件，能大大的提高你调试的效率
5. [Vue CLI](https://cli.vuejs.org/)：官方提供的一个 vue 项目脚手架，本项目也是基于它进行构建的。它帮你封装了大量的 webpack、babel 等其它配置，让你能花更少的精力在搭建环境上，从而能更专注于页面代码的编写。不过所有的脚手架都是针对大部分情况的，所以一些特殊的需求还是需要自己进行配置。建议先阅读一遍它的文档，对一些配置有一些基本的了解
6. [Vetur](https://github.com/vuejs/vetur)：VS Code 的插件. 如果你使用 VS Code 来写 vue 的话，这个插件是必不可少的
7. [Vue I18n](https://vue-i18n.intlify.dev/)：Vue.js 的国际化插件。它可以轻松地将一些本地化功能集成到你的 Vue.js 应用程序中

Webpack —— 打包工具

- 官网链接：[https://www.webpackjs.com/](https://www.webpackjs.com/)
- 介绍：是一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 _bundles_，它们均为静态资源，用于展示你的内容
- 版本要求：Vue-cli >= 5，内部集成 webpack5

Sass —— CSS 预处理器

- 官网链接：[https://www.sass.hk/](https://www.sass.hk/)
- 介绍：世界上最成熟、最稳定、最强大的专业级 CSS 扩展语言
- 版本要求：sass >= 1.60，sass-loader >= 12

echarts —— 图表工具

- 官网链接：[https://echarts.apache.org/zh/index.html](https://echarts.apache.org/zh/index.html)
- 介绍：一个基于 JavaScript 的开源可视化图表库
- 版本要求：echarts >= 5，echarts-liquidfill >= 3

### 🚩 运行和安装

- ##### 安装依赖

```bash
$ npm install
```

- ##### 运行项目

```bash
$ npm run dev       # run all
$ npm run dev:admin # run one -> admin
$ npm run dev:other # run one -> other
```

- ##### 项目打包命令

```bash
$ npm run build       # build all
$ npm run build:admin # build one -> admin
$ npm run build:other # build one -> other
```

## ⭕ 规范

### 1️⃣ 命名规范

首字母大写：PascalCase。短横线：kebab-case

- **项目命名**：全部 kebab-case 命名

  比如：`my-project`

- **组件命名**：所有组件使用大写开头 PascalCase 命名规范

  比如：`@/components/BackToTop/index.vue`

- **文件命名**：所有 `.js` 都是用 kebab-case（例外：hooks 使用 PascalCase）

  比如：`@/utils/des-base64.js`

- **目录命名**：所有目录文件那使用 kebab-case，有复数结构要采用复数命名法

  比如：`scripts`、`styles`、`components`、`images`、`views`、`utils`

- **页面命名**：在 `src/views` 中，代表路由的 `.vue` 文件都是用 kebab-case

  比如：`@/views/svg-icons/index.vue`

### 2️⃣ Git提交规范

Git 每次提交代码时加上手写 **提交说明（Commit message）**：

- 可以参考：[vuejs Pull requests](https://github.com/vuejs/core/pulls)

  Git 提交内容需要包含（做一个简化）：`type`（类型）、`commit`（详细信息）

  示例：`fix: 解决xxx出现的bug`

`type` 用于说明 `commit` 提交性质，通常值为下表：

| 值       | 描述                                                        |
| -------- | ----------------------------------------------------------- |
| feat     | 新增一个功能                                                |
| fix      | 修复一个 Bug                                                |
| docs     | 文档变更                                                    |
| style    | 代码格式（修复 Eslint 报错）                                |
| refactor | 代码重构                                                    |
| perf     | 改善性能                                                    |
| test     | 测试                                                        |
| build    | 变更项目构建或外部依赖（webpack、npm）                      |
| ci       | 更改持续集成软件的配置文件和 package.json 中的 scripts 命令 |
| chore    | 变更构建流程或辅助工具                                      |
| revert   | 代码回退                                                    |

### 3️⃣ 格式化规范

VSCode 开发和 WebStorm 开发最好都安装 Prettier 这个插件，根目录配置 `prettierrc.js`

```js
module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾不需要有分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: true,
  // jsx 标签的反尖括号需要换行
  bracketSameLine: false,
  // 末尾不需要有逗号
  trailingComma: 'none',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // 箭头函数，只有一个参数的时候，不需要括号
  arrowParens: 'avoid',
  // 所有元素间的空格都会被忽略，直接另起一行
  htmlWhitespaceSensitivity: 'ignore',
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: 'lf',
  // 格式化模板字符串里的内容
  embeddedLanguageFormatting: 'auto',
  // html, vue, jsx 中每个属性占一行
  singleAttributePerLine: false,
  // 使用默认的折行标准
  proseWrap: 'preserve'
}
```

### 4️⃣ 代码规范

涉及的比较多，遵循 `.eslintrc.js` 里面的规范

## 📦 Webpack处理

### 🐭 Preload

执行 `npm run build`，plugin 报错信息

```bash
Error: Cannot call .tap() on a plugin that has not yet been defined. Call plugin('preload')
```

> 参考：[https://cli.vuejs.org/zh/config/#pages](https://cli.vuejs.org/zh/config/#pages) 这里面的提示
>
> ![image-20231211154107533](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231211154107533.png)

试图修改 `html-webpack-plugin` 和 `preload-webpack-plugin` 插件的选项，需要额外处理

```bash
$ npm install @vue/preload-webpack-plugin -D
+ "@vue/preload-webpack-plugin": "^2.0.0"
```

之前直接使用 tap 连接即可，现在需要指定 plugin，Vue-cli4 的配置如下：

```js
Object.keys(pages).forEach(pageName => {
  config.plugin(`preload-${pageName}`).tap(() => [
    {
      rel: 'preload',
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
      include: 'initial'
    }
  ])
  config.plugins.delete(`prefetch-${pageName}`)
  config
    .plugin('ScriptExtHtmlWebpackPlugin')
    .after('html-' + pageName)
    .use('script-ext-html-webpack-plugin', [
      {
        inline: /runtime\..*\.js$/
      }
    ])
    .end()
})
```

Vue-cli5 里不能使用 ScriptExtHtmlWebpackPlugin

![image-20231211180150621](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231211180150621.png)

```js
/** vue.config.js */
Object.keys(pages).forEach(pageName => {
  config.plugin(`preload-${pageName}`).use(require('@vue/preload-webpack-plugin'), [
    {
      rel: 'preload',
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
      include: 'initial'
    }
  ])
  config.plugins.delete(`prefetch-${pageName}`)
})
```

### 🐮 CDN

由于内网可能无法访问外网问题，可以搭建 npm 私库 nexus

1. 在 `vue.config.js` 的 `chainWebpack` 或 `configureWebpack ` 中对 `externals` 配置小外部使用的包

   ```js
   /** vue.config.js */
   const isProduction = process.env.NODE_ENV === 'production'
   const assetsCDN = {
     echarts: 'echarts'
   }
   module.exports = {
     configureWebpack: {
       externals: isProduction ? assetsCDN.externals : {}
     }
   }
   ```

2. 在各个目录下的 `index.html` 里引入对应的包（`public.html` 只是向导页与其他页面无关，可以不引入）

   ```html
   <!-- public/index.html -->
   <script src="https://cdn.bootcdn.net/ajax/libs/echarts/4.8.0/echarts-en.common.min.js"></script>
   ```

但是如果想增加一个 CDN 链接就需要改两个文件，这样不是很好，所以可以将 JS 链接和 `externals` 要提取的文件名都放在一个对象里面

```js
/** vue.config.js */
const isProduction = process.env.NODE_ENV === 'production'
const assetsCDN = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.6.4/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js'
  ]
}
module.exports = {
  configureWebpack: {
    externals: isProduction ? assetsCDN.externals : {}
  },
  chainWebpack: config => {
    if (isProduction) {
      Object.keys(pages).forEach(pageName => {
        config.plugin(`html-${pageName}`).tap(args => {
          args[0].cdn = assetsCDN
          return args
        })
      })
    }
  }
}
```

之后通过 webpack + ejs 自动写入到 `public/index.html` 即可

```html
<!-- public/index.html -->
<% for (var i in htmlWebpackPlugin.options.cdn && htmlWebpackPlugin.options.cdn.js) { %>
	<script type="text/javascript" src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
<% } %>
```

### 🐯 Terser

> Terser 里面其它配置可以参考：[https://github.com/terser/terser#minify-options](https://github.com/terser/terser#minify-options)

删除 console，可以使用 terser

```js
/** vue.config.js */
config.optimization.minimizer('terser').tap(options => {
  // 注释console.*
  options[0].terserOptions.compress.drop_console = true
  // debugger
  options[0].terserOptions.compress.drop_debugger = true
  // 全部注释
  args[0].terserOptions.output = {
    comments: false
  }
  return options
})
```

或是使用 babel 去掉 console，需要安装 `babel-plugin-transform-remove-console`

```bash
$ npm install babel-plugin-transform-remove-console -D
```

更改 `babel.config.js`

- 开发环境使用 `babel-plugin-dynamic-import-node`
- 生产环境删除 console

```js
/** babel.config.js */
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  env: {
    development: {
      plugins: ['dynamic-import-node']
    },
    production: {
      plugins: ['transform-remove-console']
    }
  }
}
```

### 🐰 SplitChunks

> [手摸手，带你用合理的姿势使用 webpack4（下）](https://segmentfault.com/a/1190000015919928)

vue-element-admin 根据体积大小、共用率、更新频率重新划分包，对代码进行如下的划分：

基础类库：`chunks-libs`

- 比如：`vue` + `vue-router` + `vuex` + `axios`，它的升级频率不高，但每个页面都需要它们

UI 组件库：`chunk-elementUI`

- 它实在比较大，`Element` gzip 压缩后还得接近 200kb，UI 组件库的更新频率也会比 libs 高一点，建议 UI 组件库也单独拆成一个包

自定义组件/函数：`chunk-commons`

- 必要组件如：路由表、全局 state、全局侧边栏/Header/Footer 等组件，默认都会打包到 `app.js` 中
- 非必要组件：比如封装的 select、table 组件，体积不但但引用次数多，默认会打包到每一个懒加载的 chunk 中，造成不少的浪费

低频组件

- 比如富文本编辑器、`echarts` 等，大于 30kb，默认会打包具体使用它的页面 bundle 中

```js
/** vue.config.js */
config.when(isProduction, config => {
  // 分包策略
  config.optimization.splitChunks({
    chunks: 'all',
    cacheGroups: {
      libs: {
        name: 'chunk-libs',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        chunks: 'initial' // 只打包初始时依赖的第三方
      },
      elementUI: {
        name: 'chunk-elementUI',
        priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
        test: /[\\/]node_modules[\\/]_?element-ui(.*)/
      },
      commons: {
        name: 'chunk-commons',
        test: resolve(`src/components`),
        minChunks: 3, // 最小共用次数
        priority: 5,
        reuseExistingChunk: true
      }
    }
  })
  // 将runtime代码单独打包
  config.optimization.runtimeChunk('multiple')
})
```

### 🐲 Title

之前 `index.html` 的标题是通过 ejs 设置的

1. Webpack： `<%= webpackConfig.name %>` 打包写入进去的
2. HTMLWebpackPlugin：`<%= htmlWebpackPlugin.options.title %>` 打包写入进去的

```html
<title><%= webpackConfig.name %></title>
<!-- or -->
<title><%= htmlWebpackPlugin.options.title %></title>
```

```js
/** vue.config.js */
const name = 'XX管理系统'
module.exports = {
  configureWebpack: {
    name: name, // webpack
    plugins: [
      new HtmlWebpackPlugin({
        title: name, // HTMLWebpackPlugin
      })
    ]
  }
}
```

但是使用这个方法比较难做到国际化

- 如果需要国际化，可以在路由导航守卫 `router.beforeEach` 里设置了

### 🐍 IE

如果需要考虑 IE 兼容

1. 删除 `.browserslistrc` 文件里的 ~~not dead~~
2. `vue.config.js` 文件里添加 `transpileDependencies: true`

#### CSS兼容问题

> 可以这个网站进行查询：[https://caniuse.com/](https://caniuse.com/)

1. flex 布局不要使用 `justify-content: space-evenly`（不支持 Chorme 56 版本以下）

2. 在不给 `display: flex` 的情况下直接给 `flex: 1` 在低版本浏览器会造成高度不能自动撑开（原因：`flex-grow: 1` 没生效）

   ```css
   .table-wrapper {
     display: flex;
     flex-direction: column;
     flex: 1;
   }
   ```

3. 绝对定位 `position: absolute` 需要把 `left/right` 和 `top/bottom` 都写上，不然在低版本浏览器会出现位置错乱情况

   - 无法使用 `flex` 布局且知道宽高时，可以使用 `left + ﹣margin-left` 和 `top + -margin-top`
   - 使用 transform 在 IE 浏览器可能出现撑开盒子的情况（出现滚动条）建议不使用

   ```css
   .login-shadow {
     position: absolute;
     width: 80rem * 1.06;
     height: 37.5rem * 1.06;
     left: 50%;
     top: 50%;
     margin-left: -80rem * 1.06 / 2;
     margin-top: -37.5rem * 1.06 / 2;
     /* transform: translate(-50%, -50%); */
   }
   ```

4. IE11 CSS3 样式部分会出现问题

   - 比如：filter 有开源的 [polyfill](https://github.com/Schepp/CSS-Filters-Polyfill) 不过不支持 IE10+ 支持 IE6-9

#### JS兼容问题

`crypto-js 缺少 ")"`

- 解决方案：`crypto-js` 由 4.x 版本切换至 3.x 版本

`SyntaxError: 语法错误 ./node_modules/jsencrypt/bin/jsencrypt.js`

- 解决方案：`jsencrypt` 由 3.x 版本切换至 3.0 版本

项目已经使用了 `@vue/cli-plugin-babel/preset` 已经对代码进行了 babel 转换

- 但是像 ElementUI 这种并没有进行 babel 转换。可以使用 Vue-cli 的 `transpileDependencies: true`

使用可选链（`?.`）打包报错，空值合并运算符（`??`）同理

> 使用对应新语法打包失败，需要安装的参考 babel 官网[https://babeljs.io/docs/babel-preset-env](https://babeljs.io/docs/babel-preset-env)

- 安装 `@babel/plugin-transform-optional-chaining`

  ```bash
  $ npm install @babel/plugin-transform-optional-chaining -D
  ```

  配置 `babel.config.js`

  ```js
  module.exports = { 
    plugins: ["@babel/plugin-transform-optional-chaining"]
  }
  ```

下载 Blob 文件兼容 IE

- 使用 `window.navigator.msSaveBlob` 判断一下

  ```js
  if (window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(blob, fileName) // ie 浏览器
    } catch (e) {
      // console.log(e)
    }
  } else {
    const URL = window.URL || window.webkitURL
    const link = document.createElement('a')
    const href = URL.createObjectURL(blob)
    link.href = href
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(href)
  }
  ```

### 🐴 Pom

虽然前后端分离十分流行，但是前后端一起使用 Maven 进行打为 jar 包的项目也是个较为常见的作法

需要在根目录添加 `pom.xml` 即可

- pom 是 Project Object Model（项目对象模型）的缩写，是 Maven 中的项目文件，可用于管理与配置依赖，组织信息，项目授权，远程仓库等等
