import { regularEmail } from './../regEmail';
import * as Joi from '@hapi/joi'
import * as express from 'express'
import {
  createValidator
} from 'express-joi-validation'

const validator = createValidator()
const p = '/^[0-9+]{7}-[0-9+]{1}$/';

const signUpBodySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().regex(regularEmail).required(),
  password: Joi.string().min(5).max(15).required(),
})

export { validator, signUpBodySchema };