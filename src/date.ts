import Luxon = require('luxon')
import { mapTransform } from 'map-transform'
import mapAny = require('map-any')
import { Transformer } from 'integreat'
import { isDate } from './utils/is'

const { DateTime } = Luxon

const LEGAL_PERIOD_TYPES = [
  'year',
  'quarter',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
]

export type PeriodType =
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'

export type PeriodObject = Record<PeriodType, number | string>

export interface Operands extends Record<string, unknown> {
  format?: string
  tz?: string
  isSeconds?: boolean
  add?: PeriodObject
  subtract?: PeriodObject
  set?: PeriodObject
  path?: string
}

export interface State {
  rev?: boolean
}

const periodStringFromType = (type: string) =>
  LEGAL_PERIOD_TYPES.includes(type) ? `${type}s` : undefined

function extractPeriodValue(value: number | string, data?: unknown) {
  if (typeof value === 'string') {
    // When `value` is a string, we treat it as a path into the data originally
    // passed to the transformer and retrieve that data as the value for this
    // period
    value = mapTransform(value)(data)
  }

  return typeof value === 'number' ? value : undefined
}

const periodFromObject = (obj: PeriodObject, data?: unknown) =>
  Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [
        periodStringFromType(key),
        extractPeriodValue(value, data),
      ])
      .filter(([key]) => !!key)
  )

function modifyDate(
  date: Luxon.DateTime,
  add?: PeriodObject,
  subtract?: PeriodObject,
  set?: PeriodObject,
  data?: unknown
) {
  if (add) {
    date = date.plus(periodFromObject(add, data))
  }
  if (subtract) {
    date = date.minus(periodFromObject(subtract, data))
  }
  if (set) {
    date = date.set(periodFromObject(set, data))
  }
  return date
}

export function castDate(operands: Operands = {}) {
  const { tz: zone, format, add, subtract, set, path } = operands
  const isSeconds = operands.isSeconds === true // Make sure this is true and not just truthy
  const getFromPath =
    typeof path === 'string' ? mapTransform(path) : (value: unknown) => value

  return function doCastDate(data: unknown) {
    const value = getFromPath(data)
    let date = undefined

    if (value === null) {
      return null
    } else if (isDate(value)) {
      if (!Number.isNaN(value.getTime())) {
        date = DateTime.fromJSDate(value)
      }
    } else if (typeof value === 'string') {
      if (format || zone) {
        // Use Luxon when a format or timezone is given ...
        date = format
          ? DateTime.fromFormat(value, format, { zone })
          : DateTime.fromISO(value, { zone })
      } else {
        // ... otherwise use normal JS parsing to do the best we can
        date = DateTime.fromJSDate(new Date(value))
      }
    } else if (typeof value === 'number') {
      date = isSeconds
        ? DateTime.fromSeconds(value)
        : DateTime.fromMillis(value)
    }

    if (!date || !date.isValid) {
      return undefined
    }

    return date ? modifyDate(date, add, subtract, set, data).toJSDate() : date
  }
}

function format(operands: Operands) {
  const { tz: zone, format, path, ...modifiers } = operands
  const isSeconds = operands.isSeconds === true // Make sure this is true and not just truthy
  const setToPath =
    typeof path === 'string'
      ? mapTransform(`>${path}`)
      : (value: unknown) => value

  return function doFormatDate(value: unknown) {
    const date = castDate(modifiers)(value)
    if (!isDate(date) || Number.isNaN(date.getTime())) {
      return undefined
    }

    let dateTime = DateTime.fromJSDate(date)
    if (zone) {
      dateTime = dateTime.setZone(zone)
    }

    if (!format) {
      return setToPath(isSeconds ? dateTime.toSeconds() : dateTime.toISO())
    } else {
      return setToPath(dateTime.toFormat(format))
    }
  }
}

const revOperands = ({ add, subtract, ...operands }: Operands) => ({
  ...operands,
  add: subtract,
  subtract: add,
})

export const formatDate: Transformer = function transformDate(
  operands: Operands
) {
  const formatFn = mapAny(format(operands))

  // Format regardless of direction
  return (data: unknown, _state: State) => formatFn(castDate()(data))
}

const transformer: Transformer = function transformDate(operands: Operands) {
  const formatFn = mapAny(format(revOperands(operands)))
  const castFn = mapAny(castDate(operands))

  // Cast from service and format to service
  // Note: We're casting value from Integreat too, in case it arrives as an ISO
  // string. This should probably not be necessary, but it happens, so we need
  // to account for it.
  return (data: unknown, state: State) =>
    state.rev ? formatFn(data) : castFn(data)
}

export default transformer
