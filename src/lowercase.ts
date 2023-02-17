import mapAny = require('map-any')
import { Transformer } from 'map-transform'

const lowercase: Transformer = (_operands, _options) => (value, _context) =>
  mapAny(
    (value) => (typeof value === 'string' ? value.toLowerCase() : value),
    value
  )

export default lowercase
