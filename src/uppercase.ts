import type { Transformer } from 'integreat'
import mapAny = require('map-any')

const uppercase: Transformer = (_operands, _options) => (value, _context) =>
  mapAny(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    value
  )

export default uppercase
