import mapAny = require('map-any')
import { Transformer } from 'integreat'
import { isDate } from './utils/is'

const numberOrUndefined = (value: number) => (isNaN(value) ? undefined : value)

function castNumber(value: unknown) {
  if (typeof value === 'number') {
    return numberOrUndefined(value)
  } else if (value === null || value === undefined) {
    return value
  } else if (typeof value === 'string') {
    return numberOrUndefined(Number.parseFloat(value))
  } else if (typeof value === 'boolean') {
    return Number(value)
  } else if (isDate(value)) {
    return numberOrUndefined(value.getTime())
  } else {
    return undefined
  }
}
const transformer: Transformer = () => mapAny(castNumber)

export default transformer
