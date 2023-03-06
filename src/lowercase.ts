import type { Transformer } from 'integreat'
import mapAny = require('map-any')

const lowercase: Transformer = (_operands, _options) => (value, _context) =>
  mapAny(
    (value) => (typeof value === 'string' ? value.toLowerCase() : value),
    value
  )

export default lowercase
