const express = require('express')
const { decryptAPI, encryptAPI } = require('../config')
const { decryptAES, encryptAES } = require('../utils/aes-base64')
const { PRIVATE_KEY, JWT_EXPIRED, verifyJwtToken } = require('../utils/jwt')
const { dynamicRoutes } = require('../utils/dynamic')
const jwt = require('jsonwebtoken')

const router = express.Router()

const userDBList = [
  { username: 'other', password: 'other123' },
  { username: 'person', password: 'person123' }
]
router.post('/login', (req, res, next) => {
  const data = req.body
  if (decryptAPI) {
    try {
      const resData = decryptAES(data.encryptStr)
      const { username, password } = JSON.parse(resData)
      const userFilter = userDBList.some(v => {
        return v.username === username && v.password === password
      })
      if (userFilter) {
        const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: JWT_EXPIRED })
        res.json({
          code: 200,
          data: {
            token
          },
          msg: '登录成功'
        })
      } else {
        res.json({
          code: 601,
          data: null,
          msg: '账户或密码错误'
        })
      }
    } catch (e) {
      res.json({
        code: 602,
        data: null,
        msg: '账号或密码不合法'
      })
    }
  }
})

router.get('/getUserInfo', (req, res) => {
  const valid = verifyJwtToken(req)
  if (valid) {
    let user = {
      operator: { operatorName: 'admin', avatar: null },
      menuList: dynamicRoutes,
      buttonList: ['*:*:*']
    }
    if (encryptAPI) user = encryptAES(JSON.stringify(user))
    res.json({
      code: 200,
      data: user,
      msg: '用户信息查询成功'
    })
  } else {
    res.json({
      code: 603,
      data: null,
      msg: '用户信息查询失败'
    })
  }
})

router.post('/logout', (req, res) => {
  res.json({
    code: 200,
    data: null,
    msg: '退出登录成功'
  })
})

router.post('/changePwd', (req, res) => {
  const data = req.body
  if (decryptAPI) {
    try {
      const resData = decryptAES(data.encryptStr)
      console.log(resData)
    } catch (e) {
      // console.log(e)
    }
  }
  res.json({
    code: 200,
    data: null,
    msg: '实际没有改密码哦！'
  })
})

module.exports = router
