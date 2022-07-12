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

export interface Context {
  rev: boolean
  onlyMappedValues: boolean
}

const castDate = (format?: string, zone?: string, isSeconds = false) =>
  function castDate(value: unknown) {
    if (value === null || value === undefined) {
      return value
    } else if (isDate(value)) {
      return isNaN(value.getTime()) ? undefined : value
    } else if (typeof value === 'string') {
      if (format || zone) {
        // Use Luxon when a format or timezone is given ...
        const date = format
          ? DateTime.fromFormat(value, format, { zone })
          : DateTime.fromISO(value, { zone })

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

const formatDate = (format?: string, zone?: string, isSeconds = false) =>
  function formatDate(value: unknown) {
    if (!isDate(value) || Number.isNaN(value.getTime())) {
      return undefined
    }

    let date = DateTime.fromJSDate(value)
    if (zone) {
      date = date.setZone(zone)
    }

    if (!format) {
      return isSeconds ? date.toSeconds() : date.toISO()
    } else {
      return date.toFormat(format)
    }
  }

const transformer: Transformer = function transformDate(operands: Operands) {
  const zone = operands.tz
  const format = operands.format
  const isSeconds = operands.isSeconds === true // Make sure this is true and not just truthy

  const formatFn = mapAny(formatDate(format, zone, isSeconds))
  const castFn = mapAny(castDate(format, zone, isSeconds))

  return (data: unknown, context: Context) =>
    context.rev ? formatFn(data) : castFn(data)
}

export default transformer
