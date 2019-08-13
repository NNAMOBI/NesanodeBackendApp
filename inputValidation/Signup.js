const Joi = require("@hapi/joi");

const schema = Joi.object().keys({
  fullname: Joi.string()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .min(7)
    .max(15)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required()
});

module.exports = schema;
