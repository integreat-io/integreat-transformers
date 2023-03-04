export const isObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]'

export const isDate = (value: unknown): value is Date =>
  Object.prototype.toString.call(value) === '[object Date]'

export const isNotEmpty = <T>(value: T): value is NonNullable<T> => !!value

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number'
