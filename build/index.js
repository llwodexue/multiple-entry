const chalk = require('chalk')
const rimraf = require('rimraf')
const { sh } = require('tasksfile')
const PAGES = require('./pages')

const mode = process.env.NODE_ENV || 'production'
const pageList = Object.keys(PAGES)
// 模块名，可能为多个，多个通过 , 分割
const moduleNames = process.argv[2]

// 生产环境：有效模块列表，未指定则为全部页面列表
const validPageList = moduleNames ? moduleNames.split(',').filter(item => pageList.includes(item)) : pageList
if (!validPageList.length) {
  console.log(chalk.red('**模块名不正确**'))
  return
}
console.log(chalk.cyan(`有效模块:${validPageList.join(',')}`))


// 删除 dist 目录
try {
  rimraf.sync('dist')
} catch (err) {
  console.log(err)
  sh(`rm -rf dist`)
}

// 逐个执行模块编译
console.time('总编译时间')
const count = validPageList.length
let current = 0
for (let i = 0; i < validPageList.length; i += 1) {
  const moduleName = validPageList[i]
  process.env.MODULE_NAME = moduleName
  console.log(chalk.blue(`${moduleName} 模块开始编译`))
  // 通过 vue-cli-service build 编译
  sh(`vue-cli-service build --mode ${mode}`, { async: true }).then(() => {
    console.log(chalk.blue(`${moduleName} 模块编译完成`))
    console.log()
    current += 1
    if (current === count) {
      console.log(chalk.green('-----全部模块编译完成-----'))
      console.timeEnd('总编译时间')
      sh(`cp index.html dist`)
      sh(`cp public/favicon.ico dist`)
      console.log(chalk.green('-----文件拷贝完成-----'))
    }
  })
}
