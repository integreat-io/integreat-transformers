import decircular from 'decircular'
import sortKeys from 'sort-keys'
import { mapTransformSync } from 'map-transform'
import mapAny from 'map-any'
import { hashString, uint8ArrayToHex } from './utils/hash.js'
import { isDate, isObject } from './utils/is.js'
import type { Transformer, SyncDataMapper } from 'map-transform/types.js'

export interface Props extends Record<string, unknown> {
  includeKeys?: string[]
}

/**
 * Normalizes an object, to prepare it for hashing.
 *
 * More or less copy/paste from the [hash-object](https://github.com/sindresorhus/hash-object)
 * package, but implemented here to avoid using `node:crypto`.
 */
function normalizeObject(object: unknown): unknown {
  if (typeof object === 'string') {
    return object.normalize('NFD')
  }

  if (Array.isArray(object)) {
    return object.map((element) => normalizeObject(element))
  }

  if (isObject(object)) {
    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => [
        key.normalize('NFD'),
        normalizeObject(value),
      ]),
    )
  }

  return object
}

/**
 * Take the given value and return a string that has been prepared for hashing.
 */
function prepareForHashing(value: unknown): string {
  if (isObject(value)) {
    const normalizedObject = normalizeObject(decircular(value)) as Record<
      string,
      unknown
    >
    return JSON.stringify(sortKeys(normalizedObject, { deep: true }))
  } else if (isDate(value)) {
    return value.toISOString()
  } else {
    return String(value)
  }
}

/**
 * Generate a checksum by hashing an object, a date, or a plain value. `null`
 * and `undefined` are returned untouched.
 */
const hashValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return value
  } else {
    const hashable = prepareForHashing(value)
    return uint8ArrayToHex(hashString(hashable))
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
