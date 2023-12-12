const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const PAGES = require('./build/pages')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const port = process.env.port || 9530
const isProduction = process.env.NODE_ENV === 'production'
let moduleName = process.env.MODULE_NAME || 'admin'
let pages = {}

for (const basename in PAGES) {
  if (Object.prototype.hasOwnProperty.call(PAGES, basename)) {
    PAGES[basename].chunks = ['chunk-libs', 'chunk-elementUI', 'chunk-commons', `${basename}`]
  }
}
// 有效模块列表，未指定则为全部页面列表
const devModule = process.env.DEV_MODULE || 'all'
if (devModule === 'all') {
  pages = PAGES
} else {
  pages[devModule] = PAGES[devModule]
}

module.exports = defineConfig({
  // transpileDependencies: true,
  publicPath: isProduction ? `./` : '/',
  pages,
  outputDir: `dist/${moduleName}`,
  // assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    client: {
      overlay: false
    },
    proxy: {
      '^/admin': {
        target: 'http://127.0.0.1:3005/admin',
        pathRewrite: {
          '^/admin': ''
        },
        changeOrigin: true
      },
      '^/other': {
        target: 'http://127.0.0.1:3005/other',
        pathRewrite: {
          '^/other': ''
        },
        changeOrigin: true
      }
    },
    allowedHosts: 'all'
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@admin': resolve('src/pages/admin'),
        '@other': resolve('src/pages/other')
      },
      fallback: {
        path: require.resolve('path-browserify')
      }
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 20 * 1000 * 1000,
      maxAssetSize: 20 * 1000 * 1000
    }
  },
  chainWebpack(config) {
    // 多入口添加preload需要逐一遍历
    Object.keys(pages).forEach(name => {
      config.plugin(`preload-${name}`).use(require('@vue/preload-webpack-plugin'), [
        {
          rel: 'preload',
          fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
          include: 'initial'
        }
      ])
      // 删除页面内一些无意义请求
      config.plugins.delete(`prefetch-${name}`)
    })

    config.optimization.minimizer('terser').tap(options => {
      options[0].terserOptions.compress.drop_console = true
      options[0].terserOptions.compress.drop_debugger = true
      return options
    })

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve(`src/assets/icons`)).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve(`src/assets/icons`))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 开发环境的sourceMap配置
    config.when(!isProduction, config => config.devtool('eval-cheap-module-source-map'))

    // 生产环境的配置
    config.when(isProduction, config => {
      // 分包策略
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve(`src/components`),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // 将runtime代码单独打包。注意：由于是多入口打包不能使用single
      config.optimization.runtimeChunk('multiple')
    })
  }
})
