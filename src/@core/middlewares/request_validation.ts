import * as Joi from '@hapi/joi'
import * as express from 'express'
import {
  createValidator
} from 'express-joi-validation'

const validator = createValidator()

const signUpBodySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().min(5).max(15).required(),
})

export { validator, signUpBodySchema };