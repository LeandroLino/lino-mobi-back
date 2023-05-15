const jwt = require('jsonwebtoken')
const db = require('./db')
const { userRegisterSchema, userLoginSchema, userUpdateSchema } = require('./schemas/userSchemas')
const { telephoneSchema } = require('./schemas/telephoneSchemas')

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
    return
  }
  next()
}

async function validatePayload (req, res, next) {
  let validatePayload = {}
  switch (req.route.path) {
    case '/user/update':
      validatePayload = userUpdateSchema.validate(req.body)
      break
    case '/user/login':
      validatePayload = userLoginSchema.validate(req.body)
      break
    case '/user/register':
      validatePayload = userRegisterSchema.validate(req.body)
      break
    case '/telephone/update/:id':
      validatePayload = telephoneSchema.validate(req.body)
      break
    case '/telephone/create/':
      validatePayload = telephoneSchema.validate(req.body)
      break
    default:
  }
  if (validatePayload.error) {
    res.status(403).send({ code: 403, message: validatePayload.error.details[0].message })
    return
  }
  next()
}

module.exports = {
  verifyToken,
  hasUser,
  validatePayload
}
