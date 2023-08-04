import mapAny from 'map-any'
import { isObject, isDate } from './utils/is.js'
import type { Transformer } from 'integreat'

export function castString(value: unknown) {
  if (value === null || value === undefined) {
    return value
  } else if (isDate(value)) {
    return value.toISOString()
  } else if (isObject(value)) {
    return undefined
  } else {
    return String(value)
  }
}

const transformer: Transformer = () => () => mapAny(castString)

export default transformer
