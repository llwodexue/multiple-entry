const isProduction = process.env.NODE_ENV === 'production'
process.argv[2] === 'inspect' && console.log('const obj =')

const pages = {
  admin: {
    title: '检票',
    entry: 'src/pages/admin/main.js',
    template: 'index.html',
    filename: isProduction ? 'index.html' : 'admin/index.html'
  },
  mobile: {
    title: '验票',
    entry: 'src/pages/mobile/main.js',
    template: 'index.html',
    filename: isProduction ? 'index.html' : 'mobile/index.html'
  }
}

module.exports = pages
