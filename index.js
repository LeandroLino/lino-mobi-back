const app = require('express')()
require('dotenv').config()
const bodyParser = require('body-parser')
const utils = require('./utils')
const middlewares = require('./middlewares')
const jwt = require('jsonwebtoken')

const cors = require('cors')
app.use(cors())

const db = require('./db')

app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  res.send('OK')
  next()
})

app.post('/user/register', middlewares.validatePayload, middlewares.hasUser, async (req, res, next) => {
  if (!utils.validatePassword(req.body.password)) {
    res.status(400).send({
      message: 'The password do not match with the requirements.',
      code: 400
    })
    return
  }

  const hashPassword = await utils.encryptPassword(req.body.password)
  const user = await db.createUser(req.body.name, req.body.email, hashPassword, req.body.telephones)
  res.status(200).send({ id: user.id, created_at: user.created_at, modified_at: user.modified_at })
  next()
})

app.post('/user/login', middlewares.validatePayload, async (req, res, next) => {
  const response = await db.loginUser(req.body.email, req.body.password)

  if (response.code) {
    res.status(response.code).send(response)
    return
  }

  const token = jwt.sign({ id: response.id, email: req.body.email }, process.env.SECRET_KEY_JWT, { expiresIn: '120h' })
  res.status(200).send({ token })
  next()
})

app.get('/user/search', middlewares.verifyToken, async (req, res, next) => {
  const user = await db.getUserByEmail(req.body.decoded.email)

  const telephones = await db.getTelephonesByUserId(req.body.decoded.id)
  user.telephones = telephones

  delete user.password

  delete telephones.created_at
  delete telephones.modified_at

  res.status(200).send(user)
  next()
})

app.delete('/user/delete', middlewares.verifyToken, async (req, res, next) => {
  await db.deleteUserById(req.body.decoded.id)
  res.status(202).send({})
  next()
})

app.put('/user/update', middlewares.validatePayload, middlewares.verifyToken, async (req, res, next) => {
  const userId = req.body.decoded.id
  const user = await db.getUserByEmail(req.body.decoded.email)
  delete req.body.decoded

  if (!user) {
    res.status(404).send({ code: 404, message: 'Not found user' })
  }
  if (req.body.password) {
    if (!utils.validatePassword(req.body.password)) {
      res.status(400).send({
        message: 'The password do not match with the requirements.',
        code: 400
      })
      return
    }

    req.body.password = await utils.encryptPassword(req.body.password)
  }
  const token = jwt.sign({ id: userId, email: req.body.email }, process.env.SECRET_KEY_JWT, { expiresIn: '120h' })

  await db.updateUserById(userId, req.body)
  const newUser = await db.getUserByEmail(user.email)
  delete newUser.password

  res.status(200).send({ user: newUser, token })
  next()
})

app.put('/telephone/update/:id', middlewares.validatePayload, middlewares.verifyToken, async (req, res, next) => {
  if (!utils.validateTelephoneNumber(req.body.number)) {
    res.status(400).send({ code: 400, message: 'The telephone do not match with the requirements.' })
    return
  }
  const telephoneId = req.params.id
  const telephone = await db.getTelephonesById(telephoneId)
  if (!telephone) {
    res.status(404).send({ code: 404, message: 'Not found telephone' })
    return
  }
  telephone.number = req.body.number
  telephone.area_code = req.body.area_code
  telephone.name = req.body.name
  await db.updateTelephoneById(telephoneId, { number: telephone.number, area_code: telephone.area_code })
  res.status(200).send(telephone)
  next()
})

app.delete('/telephone/delete/:id', middlewares.verifyToken, async (req, res, next) => {
  const telephoneId = req.params.id
  await db.deleteTelephoneById(telephoneId)
  res.status(202).send({})
  next()
})

app.post('/telephone/create/', middlewares.validatePayload, middlewares.verifyToken, async (req, res, next) => {
  const response = await db.createTelephone(req.body.decoded.id, req.body.area_code, req.body.number, req.body.name)
  if (response.code) {
    res.status(response.code).send(response)
    return
  }
  res.status(200).send(response)
  next()
})

app.listen(process.env.PORT || 3000, () => console.log(`Server running at http://localhost:${process.env.PORT || 3000}`))

module.exports = app
