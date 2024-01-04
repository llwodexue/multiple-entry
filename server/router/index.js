const express = require('express')
const expressJwt = require('express-jwt')
const { adminRouter, otherRouter } = require('./modules')
const { PRIVATE_KEY } = require('../utils/jwt')
const { UNAUTHORIZED, ERROR } = require('../utils/HttpStatus')

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

/** catch must be last */
router.use((err, req, res, next) => {
  if (err.name && err.name === 'UnauthorizedError') {
    res.json(UNAUTHORIZED)
  } else {
    const msg = (err && err.message) || '系统错误'
    const code = (err.output && err.output.statusCode) || 500
    res.json({ ...ERROR, ...{ code, msg } })
  }
})

module.exports = router
