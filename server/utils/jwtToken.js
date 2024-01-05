const jwt = require('jsonwebtoken')

const PRIVATE_KEY = 'PRIVATE_KEY'
const JWT_EXPIRED = 60 * 60
const AUTHOR_KEY = 'Authorization'
const UNLESS_PATH = ['/', '/admin/login', '/other/login']

function verifyJwtToken(req) {
  let token = req.get(AUTHOR_KEY) || ''
  if (!token) return ''
  if (token.indexOf('Bearer') >= 0) {
    token = token.replace('Bearer ', '')
  }
  console.log(token)
  return jwt.verify(token, PRIVATE_KEY)
}

module.exports = { PRIVATE_KEY, JWT_EXPIRED, verifyJwtToken, UNLESS_PATH }
