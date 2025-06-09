import { mapTransformSync } from 'map-transform'
import mapAny from 'map-any'
import { hashSync } from 'hasha'
import hashObject from 'hash-object'
import { isDate, isObject } from './utils/is.js'
import type { Transformer } from 'integreat'
import type { SyncDataMapper } from 'map-transform/types.js'

export interface Props extends Record<string, unknown> {
  includeKeys?: string[]
}

const options = { algorithm: 'sha256' }

/**
 * Generate a checksum by hashing an object, a date, or a plain value. `null`
 * and `undefined` are returned untouched.
 */
const hashValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return value
  } else if (isObject(value)) {
    return hashObject(value, options)
  } else if (isDate(value)) {
    return hashSync(value.toISOString(), options)
  } else {
    return hashSync(String(value), options)
  }
}

/**
 * If we have a `getter` function, i.e. the transformer props had `includeKeys`,
 * we'll get the object to hash before passing it on the actual hash function.
 * All other values are passed on as-is.
 */
function hashValueWithGetter(getter?: SyncDataMapper) {
  return function (value: unknown): unknown {
    if (getter && isObject(value)) {
      return hashValue(getter(value))
    } else {
      return hashValue(value)
    }
  }
}

/**
 * Will generate a hash of the data in the pipeline. For objects, `includeKeys`
 * may hold paths to the props to include in the checksum. `null` and
 * `undefined` is never hashed. An array is returned as an array of checksums
 * for each item. All other values are forced string before hashing. For dates,
 * this forcing is done by getting the ISO date string.
 */
const transformer: Transformer = function checksum({ includeKeys }: Props) {
  const getter = Array.isArray(includeKeys)
    ? mapTransformSync(
        Object.fromEntries(includeKeys.map((path) => [path, path])),
      )
    : undefined

  return (_options) => {
    return function (data, _state) {
      return mapAny(hashValueWithGetter(getter), data)
    }
  }
}

export default transformer
