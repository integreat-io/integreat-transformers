import mapAny = require('map-any')
import type { Transformer } from 'integreat'
import { isDate } from './utils/is.js'

const uriPart: Transformer = (_operands, _options) => (value, state) =>
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
