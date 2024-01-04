const express = require('express')
const { adminRouter, otherRouter } = require('./modules')
const { catchMiddleware, jwtMiddleware } = require('../middleware')

const router = express.Router()

/** jwt 401 */
router.use(jwtMiddleware)

/** router */
router.get('/', (req, res) => {
  res.send('welcome to index')
})
router.use('/admin', adminRouter)
router.use('/other', otherRouter)

/** catch must be last */
router.use(catchMiddleware)

module.exports = router
