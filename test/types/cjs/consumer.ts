// Mirrors the usage documented in README.md, from a CommonJS consumer.
import BaseJoi from 'joi'
import JoiTimezone from 'joi-tz'

const Joi = BaseJoi.extend(JoiTimezone)

export const valid = Joi.timezone().validate('Australia/Darwin')
export const invalid = Joi.timezone().required().validate('Blah')
