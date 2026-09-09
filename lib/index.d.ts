import type { Extension } from 'joi'

/**
 * Joi extension adding a `timezone()` schema that validates IANA timezone
 * strings (eg. `Europe/London`, `America/New_York`, `Etc/GMT-8`).
 *
 * @example
 * import BaseJoi from 'joi'
 * import JoiTimezone from 'joi-tz'
 *
 * const Joi = BaseJoi.extend(JoiTimezone)
 *
 * Joi.timezone().validate('Australia/Darwin')
 */
declare const joiTimezone: Extension

export = joiTimezone
