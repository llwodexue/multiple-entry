const isProduction = process.env.NODE_ENV === 'production'
process.argv[2] === 'inspect' && console.log('const obj =')

const pages = {
  admin: {
    title: 'admin管理系统',
    entry: 'src/pages/admin/main.js',
    template: 'index.html',
    filename: isProduction ? 'index.html' : 'admin/index.html'
  },
  other: {
    title: 'other管理系统',
    entry: 'src/pages/other/main.js',
    template: 'index.html',
    filename: isProduction ? 'index.html' : 'other/index.html'
  }
}

module.exports = pages
