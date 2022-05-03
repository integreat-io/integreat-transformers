import Luxon = require('luxon')
import mapAny = require('map-any')
import { Transformer } from 'integreat'
import { isDate } from './utils/is'

const { DateTime } = Luxon

export interface Operands extends Record<string, unknown> {
  format?: string
  tz?: string
  isSeconds?: boolean
}

const castDate = function (operands: Operands) {
  const luxonOptions = operands.tz ? { zone: operands.tz } : undefined
  const format = operands.format
  const isSeconds = operands.isSeconds === true // Make sure this is true and not just truthy

  return function castDate(value: unknown) {
    if (value === null || value === undefined) {
      return value
    } else if (isDate(value)) {
      return isNaN(value.getTime()) ? undefined : value
    } else if (typeof value === 'string') {
      if (format || luxonOptions) {
        // Use Luxon when a format or timezone is given ...
        const date = format
          ? DateTime.fromFormat(value, format, luxonOptions)
          : DateTime.fromISO(value, luxonOptions)

        return date.isValid ? date.toJSDate() : undefined
      } else {
        // ... otherwise use normal JS parsing to do the best we can
        const date = new Date(value)
        return !date || isNaN(date.getTime()) ? undefined : date
      }
    } else if (typeof value === 'number') {
      const date = isSeconds
        ? DateTime.fromSeconds(value)
        : DateTime.fromMillis(value)
      return date.isValid ? date.toJSDate() : undefined
    } else {
      return undefined
    }
  }
}

const transformer: Transformer = (operands: Operands) =>
  mapAny(castDate(operands))

export default transformer
