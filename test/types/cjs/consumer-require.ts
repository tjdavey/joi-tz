// Import-equals consumption, for repos using verbatimModuleSyntax without
// esModuleInterop.
import BaseJoi = require('joi')
import JoiTimezone = require('joi-tz')

const Joi = BaseJoi.extend(JoiTimezone)

export const result = Joi.timezone().validate('Australia/Darwin')
