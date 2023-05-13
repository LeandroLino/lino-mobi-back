const jwt = require('jsonwebtoken')
const db = require('./db')

async function verifyToken (req, res, next) {
  req.body.decoded = {}
  try {
    req.body.decoded.token = req.headers.authorization.split('Bearer')[1].trim()
  } catch {
    return res.status(401).send({ auth: false, message: 'No token provided.' })
  }

  if (!req.body.decoded.token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' })
  }

  jwt.verify(req.body.decoded.token, process.env.SECRET_KEY_JWT, function (err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
    }
    req.body.decoded = decoded
    next()
  })
}

async function hasUser (req, res, next) {
  const hasUser = await db.getUserByEmail(req.body.email)
  if (hasUser) {
    res.status(403).send({ code: 403, message: 'User has been created' })
  }
  next()
}

module.exports = {
  verifyToken,
  hasUser
}
