import mapAny = require('map-any')
import { Transformer } from 'integreat'
import { isObject, isDate } from './utils/is'

function castString(value: unknown) {
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

const transformer: Transformer = () => mapAny(castString)

export default transformer
