import mapAny from 'map-any'
import { isDate } from './utils/is.js'
import type { Transformer } from 'integreat'

const isEncodable = (value: unknown): value is string | number | boolean =>
  ['string', 'number', 'boolean'].includes(typeof value)

const uriPart: Transformer = () => () => (value, state) =>
  mapAny(function (value) {
    if (value === null || value === undefined) {
      return undefined
    }

    const part = isDate(value)
      ? value.toISOString()
      : isEncodable(value)
        ? value
        : undefined
    if (part === undefined) {
      return undefined
    } else {
      return state.rev ? encodeURIComponent(part) : decodeURIComponent(String(part))
    }
  })(value)

export default uriPart
