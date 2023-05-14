const Joi = require('joi')
const { telephoneSchema } = require('./telephoneSchemas')

const userRegisterSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(8).max(100).required(),
  email: Joi.string().email().required(),
  telephones: Joi.array().items(
    telephoneSchema
  )
})

const userLoginSchema = Joi.object({
  password: Joi.string().min(8).max(100).required(),
  email: Joi.string().email().required()
})

const userUpdateSchema = Joi.object({
  password: Joi.string().min(8).max(100).required(),
  email: Joi.string().email().required(),
  name: Joi.string().required()
})

module.exports = { userRegisterSchema, userLoginSchema, userUpdateSchema }
