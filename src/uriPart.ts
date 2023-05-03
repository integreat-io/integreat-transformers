import mapAny from 'map-any'
import { isDate } from './utils/is.js'
import type { Transformer } from 'integreat'

const uriPart: Transformer = () => () => (value, state) =>
  mapAny(function (value) {
    if (value === null || value === undefined) {
      return undefined
    }

    let part = value
    if (isDate(part)) {
      part = part.toISOString()
    } else if (typeof part === 'object') {
      return undefined
    }

    return state.rev ? encodeURIComponent(part) : decodeURIComponent(part)
  }, value)

export default uriPart
