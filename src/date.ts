import Luxon = require('luxon')
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

export interface PeriodObject {
  type: PeriodType
  value?: number
  valuePath?: string
}

export interface Operands extends Record<string, unknown> {
  format?: string
  tz?: string
  isSeconds?: boolean
  add?: PeriodObject
  subtract?: PeriodObject
  set?: PeriodObject
}

export interface State {
  rev?: boolean
}

const periodStringFromType = (type: PeriodType) =>
  LEGAL_PERIOD_TYPES.includes(type) ? `${type}s` : undefined

function periodFromObject(obj: PeriodObject) {
  const key = periodStringFromType(obj.type)
  return key ? { [key]: obj.value } : {}
}

function modifyDate(
  date: Luxon.DateTime,
  add?: PeriodObject,
  subtract?: PeriodObject,
  set?: PeriodObject
) {
  if (add) {
    date = date.plus(periodFromObject(add))
  }
  if (subtract) {
    date = date.minus(periodFromObject(subtract))
  }
  if (set) {
    date = date.set(periodFromObject(set))
  }
  return date
}

export function castDate(operands: Operands = {}) {
  const { tz: zone, format, add, subtract, set } = operands
  const isSeconds = operands.isSeconds === true // Make sure this is true and not just truthy

  return function doCastDate(value: unknown) {
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

    return date ? modifyDate(date, add, subtract, set).toJSDate() : date
  }
}

function format(operands: Operands) {
  const { tz: zone, format, ...modifiers } = operands
  const isSeconds = operands.isSeconds === true // Make sure this is true and not just truthy

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
      return isSeconds ? dateTime.toSeconds() : dateTime.toISO()
    } else {
      return dateTime.toFormat(format)
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
