const { UNAUTHORIZED, ERROR } = require('../utils/httpStatus')

const catchMiddleware = (err, req, res, next) => {
  if (err.name && err.name === 'UnauthorizedError') {
    res.json(UNAUTHORIZED)
  } else {
    const msg = (err && err.message) || '系统错误'
    const code = (err.output && err.output.statusCode) || 500
    res.json({ ...ERROR, ...{ code, msg } })
  }
}

module.exports = catchMiddleware
