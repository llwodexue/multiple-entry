const express = require('express')
const expressJwt = require('express-jwt')
const adminRouter = require('./admin')
const otherRouter = require('./other')
const { PRIVATE_KEY } = require('../utils/jwt')

const router = express.Router()

/** jwt */
const jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  algorithms: ['HS256'],
  credentialsRequired: true
}).unless({
  path: ['/', '/admin/login', '/other/login', '/admin/logout']
})
router.use(jwtAuth)

/** router */
router.get('/', (req, res) => {
  res.send('welcome to index')
})
router.use('/admin', adminRouter)
router.use('/other', otherRouter)
router.use((err, req, res, next) => {
  if (err.name && err.name === 'UnauthorizedError') {
    res.json({
      code: 401,
      data: null,
      msg: 'Token验证失败'
    })
  } else {
    const msg = (err && err.message) || '系统错误'
    const code = (err.output && err.output.statusCode) || 500
    res.json({
      code,
      data: null,
      msg
    })
  }
})

module.exports = router
