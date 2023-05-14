const Joi = require('joi')

const telephoneSchema = Joi.object({
  number: Joi.string().required(),
  area_code: Joi.string().required(),
  name: Joi.string().required()
})

module.exports = { telephoneSchema }
