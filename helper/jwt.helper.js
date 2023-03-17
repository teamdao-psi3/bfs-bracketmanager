const jwt = require('jsonwebtoken')

require('dotenv').config()
const env = process.env

const getPayload = (request) => {
  const authHeader = request.headers.authorization
  const token = authHeader.split(' ')[1]
  return jwt.verify(token, env.JWT_SECRET)
}

module.exports = { getPayload }