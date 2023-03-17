import mapAny = require('map-any')
import { Transformer } from 'integreat'

export interface Props extends Record<string, unknown> {
  length?: number
  postfix?: string
}

const truncate = (length?: number, postfix?: string) => {
  if (typeof length === 'number') {
    // Return truncate function if there is a specified length ...
    const postfixLength = typeof postfix === 'string' ? postfix.length : 0
    const cutLength = postfixLength < length ? length - postfixLength : length
    const appendStr = length > postfixLength ? postfix : ''

    return function doTruncate(value: unknown) {
      if (typeof value === 'string') {
        return value.length > length
          ? [value.slice(0, cutLength), appendStr].join('')
          : value
      } else {
        return undefined
      }
    }
  } else {
    // ... otherwise return a function that will just return the string if string
    return function dontTruncate(value: unknown) {
      return typeof value === 'string' ? value : undefined
    }
  }
}

const transformer: Transformer =
  ({ length, postfix }: Props) =>
  () =>
    mapAny(truncate(length, postfix))

export default transformer
