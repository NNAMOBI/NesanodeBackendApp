const Joi = require('@hapi/joi')

const Schema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).trim().required(),
    password: Joi.string().min(7).max(15).regex(/^[a-zA-Z0-9]{3,30}$/).required()
})


module.exports = Schema;