import { DateTime } from 'luxon'
import mapAny from 'map-any/async.js'
import { getPathOrData } from './utils/getters.js'
import { isDate, isNumber } from './utils/is.js'
import xor from './utils/xor.js'
import type { AsyncTransformer } from 'integreat'
import type { State } from 'map-transform/types.js'

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

const periodStringFromType = (type: string) =>
  LEGAL_PERIOD_TYPES.includes(type) ? `${type}s` : undefined

async function extractPeriodValue(value: unknown, data?: unknown) {
  if (typeof value === 'string') {
    // When `value` is a string, we treat it as a path into the data originally
    // passed to the transformer and retrieve that data as the value for this
    // period
    value = await getPathOrData(value)(data)
  }

  return isNumber(value) ? value : undefined
}

const periodFromObject = async (obj: PeriodObject, data?: unknown) =>
  Object.fromEntries(
    (
      await Promise.all(
        Object.entries(obj).map(async ([key, value]) => [
          periodStringFromType(key),
          await extractPeriodValue(value, data),
        ])
      )
    ).filter(([key]) => !!key)
  )

async function modifyDate(
  date: DateTime,
  add?: PeriodObject,
  subtract?: PeriodObject,
  set?: PeriodObject,
  data?: unknown
) {
  if (add) {
    date = date.plus(await periodFromObject(add, data))
  }
  if (subtract) {
    date = date.minus(await periodFromObject(subtract, data))
  }
  if (set) {
    date = date.set(await periodFromObject(set, data))
  }
  return date
}

export function castDate(
  value: unknown,
  zone?: string,
  format?: string,
  isSeconds = false
) {
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
  return date
}

export function castDateWithProps(props: Props = {}) {
  const { tz: zone, format, add, subtract, set, path } = props
  const isSeconds = props.isSeconds === true // Make sure this is true and not just truthy
  const pathGetter = getPathOrData(path)

  return async function doCastDate(data: unknown) {
    const value = await pathGetter(data)
    const date = castDate(value, zone, format, isSeconds)
    return date ? await modifyDate(date, add, subtract, set, data) : date
  }
}

export function castDateWithPropsJS(props: Props = {}) {
  const cast = castDateWithProps(props)

  return async function doCastDate(data: unknown) {
    const dateTime = await cast(data)
    return dateTime && dateTime.isValid ? dateTime.toJSDate() : dateTime
  }
}

function format(props: Props) {
  const { format: formatStr, path, ...modifiers } = props
  const isSeconds = props.isSeconds === true // Make sure this is true and not just truthy
  const setPath = typeof path === 'string' ? `>${path}` : undefined
  const pathSetter = getPathOrData(setPath) // Works as a setter due to the `>`

  return async function doFormatDate(value: unknown) {
    const dateTime = await castDateWithProps(modifiers)(value)
    if (!dateTime || !dateTime.isValid) {
      return undefined
    }

    if (!formatStr && !isSeconds) {
      return await pathSetter(dateTime.toJSDate())
    }

    if (formatStr === 'iso') {
      return await pathSetter(dateTime.toISO())
    } else if (typeof formatStr === 'string') {
      return await pathSetter(dateTime.toFormat(formatStr!))
    } else {
      // isSeconds === true
      return await pathSetter(dateTime.toSeconds())
    }
  }
}

const revProps = ({ add, subtract, ...props }: Props) => ({
  ...props,
  add: subtract,
  subtract: add,
})

export const formatDate: AsyncTransformer = function transformDate({
  format: formatStr,
  ...props
}: Props) {
  const formatFn = mapAny(format({ ...props, format: formatStr || 'iso' }))

  // Format regardless of direction
  return () => async (data: unknown, _state: State) =>
    await formatFn(castDateWithPropsJS()(data))
}

const transformer: AsyncTransformer = function transformDate(props: Props) {
  const formatFn = mapAny(format(revProps(props)))
  const castFn = mapAny(castDateWithPropsJS(props))

  // Cast from service and format to service
  // Note: We're casting value from Integreat too, in case it arrives as an ISO
  // string. This should probably not be necessary, but it happens, so we need
  // to account for it.
  return () => async (data, state) => {
    const isRev = xor(state.rev, state.flip)
    return isRev ? await formatFn(data) : await castFn(data)
  }
}

export default transformer
