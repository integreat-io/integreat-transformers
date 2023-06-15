/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateTime } from 'luxon'
import mapAny from 'map-any'
import { Transformer } from 'integreat'
import { getPathOrData } from './utils/getters.js'
import { isDate, isNumber } from './utils/is.js'

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

export interface Props extends Record<string, unknown> {
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

function extractPeriodValue(value: unknown, data?: unknown) {
  if (typeof value === 'string') {
    // When `value` is a string, we treat it as a path into the data originally
    // passed to the transformer and retrieve that data as the value for this
    // period
    value = getPathOrData(value)(data)
  }

  return isNumber(value) ? value : undefined
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
  date: DateTime,
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

export function castDate(props: Props = {}) {
  const { tz: zone, format, add, subtract, set, path } = props
  const isSeconds = props.isSeconds === true // Make sure this is true and not just truthy
  const pathGetter = getPathOrData(path)

  return function doCastDate(data: unknown) {
    const value = pathGetter(data)
    let date = undefined

    if (value === null) {
      return null
    } else if (isDate(value)) {
      if (!Number.isNaN(value.getTime())) {
        date = DateTime.fromJSDate(value, { zone })
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
        ? DateTime.fromSeconds(value, { zone })
        : DateTime.fromMillis(value, { zone })
    }

    if (!date || !date.isValid) {
      return undefined
    }

    return date ? modifyDate(date, add, subtract, set, data).toJSDate() : date
  }
}

function format(props: Props) {
  const { tz: zone, format: formatStr, path, ...modifiers } = props
  const isSeconds = props.isSeconds === true // Make sure this is true and not just truthy
  const setPath = typeof path === 'string' ? `>${path}` : undefined
  const pathSetter = getPathOrData(setPath) // Works as a setter due to the `>`

  return function doFormatDate(value: unknown) {
    const date = castDate(modifiers)(value)
    if (!isDate(date) || Number.isNaN(date.getTime())) {
      return undefined
    }

    if (!formatStr && !isSeconds) {
      return pathSetter(date)
    }

    let dateTime = DateTime.fromJSDate(date)
    if (zone) {
      dateTime = dateTime.setZone(zone)
    }

    if (formatStr === 'iso') {
      return pathSetter(dateTime.toISO())
    } else if (typeof formatStr === 'string') {
      return pathSetter(dateTime.toFormat(formatStr!))
    } else {
      // isSeconds === true
      return pathSetter(dateTime.toSeconds())
    }
  }
}

const revProps = ({ add, subtract, ...props }: Props) => ({
  ...props,
  add: subtract,
  subtract: add,
})

export const formatDate: Transformer = function transformDate({
  format: formatStr,
  ...props
}: Props) {
  const formatFn = mapAny(format({ ...props, format: formatStr || 'iso' }))

  // Format regardless of direction
  return (data: unknown, _state: State) => formatFn(castDate()(data))
}

const transformer: Transformer = function transformDate(props: Props) {
  const formatFn = mapAny(format(revProps(props)))
  const castFn = mapAny(castDate(props))

  // Cast from service and format to service
  // Note: We're casting value from Integreat too, in case it arrives as an ISO
  // string. This should probably not be necessary, but it happens, so we need
  // to account for it.
  return (data: unknown, state: State) =>
    state.rev ? formatFn(data) : castFn(data)
}

export default transformer
