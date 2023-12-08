const express = require('express')
const cors = require('cors')
const router = require('./router')

/** app */
const app = express()

/** cors */
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

/** router */
app.use('/', router)

/** server */
const server = app.listen(3005, () => {
  const { port } = server.address()
  console.log('running on http://127.0.0.1:%s', port)
})
