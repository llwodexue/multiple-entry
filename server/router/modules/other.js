const express = require('express')
const jwt = require('jsonwebtoken')
const { decryptAPI, encryptAPI } = require('../../config')
const { decryptAES, encryptAES } = require('../../utils/aesBase64')
const { PRIVATE_KEY, JWT_EXPIRED, verifyJwtToken } = require('../../utils/jwtToken')
const { OtherRoutes } = require('../../config/dynamic-other')
const { PASSWORD_ERROR, USER_NOT_EXIST, SUCCESS } = require('../../utils/httpStatus')

const router = express.Router()

const userDBList = [
  { username: 'other', password: 'other123' },
  { username: 'person', password: 'person123' }
]
router.post('/login', (req, res, next) => {
  let resData = req.body
  if (decryptAPI) resData = decryptAES(resData.encryptStr)
  const { username, password } = JSON.parse(resData)
  const userExit = userDBList.find(v => v.username === username)
  if (userExit) {
    if (password === userExit.password) {
      const token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: JWT_EXPIRED })
      res.json({ ...SUCCESS, data: { token }, msg: '登录成功' })
    } else {
      res.json(PASSWORD_ERROR)
    }
  } else {
    res.json(USER_NOT_EXIST)
  }
})
router.get('/getUserInfo', (req, res) => {
  const decodeJwt = verifyJwtToken(req)
  if (decodeJwt) {
    const username = decodeJwt.username
    let user = {
      operator: { operatorName: username, avatar: null },
      menuList: OtherRoutes,
      buttonList: ['*:*:*']
    }
    if (encryptAPI) user = encryptAES(JSON.stringify(user))
    res.json({ ...SUCCESS, data: user, msg: '用户信息查询成功' })
  }
})

router.post('/logout', (req, res) => {
  res.json({ ...SUCCESS, msg: '退出登录成功' })
})

router.post('/changePwd', (req, res) => {
  let resData = req.body
  if (decryptAPI) resData = decryptAES(resData.encryptStr)
  console.log(resData)
  res.json({ ...SUCCESS, ...{ msg: '实际没有改密码哦！' } })
})

module.exports = router
