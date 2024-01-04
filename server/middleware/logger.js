const path = require('path')
const log4js = require('log4js')
const { verifyJwtToken } = require('../utils/jwtToken')

const envLevel = process.env.NODE_ENV === 'prod' ? 'warn' : 'info'

log4js.configure({
  appenders: {
    // 访问日志
    access: {
      type: 'dateFile',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      keepFileExt: true,
      filename: path.join(__dirname, '/logs/access/', 'access.log')
    },
    // 系统日志
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      keepFileExt: true,
      filename: path.join(__dirname, '/logs/application/', 'application.log')
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: ['console'], level: envLevel },
    access: { appenders: ['access', 'console'], level: envLevel },
    application: { appenders: ['console'], level: envLevel }
  }
})

const logger = log4js.getLogger('access')

const loggerMiddleware = async (req, res, next) => {
  const decodeJwt = verifyJwtToken(req)
  let user = null
  if (decodeJwt) {
    user = decodeJwt.username
  }
  const msg = `
  请求用户: ${user},请求接口: ${req.url},请求类型: ${req.method}
  params入参: ${JSON.stringify(req.query)}
  body入参:  ${JSON.stringify(req.body)}\n`
  logger.info(msg)
  next()
}

module.exports = loggerMiddleware
module.systemLogger = log4js.getLogger('application')
