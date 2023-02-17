import mapAny = require('map-any')
import { Transformer } from 'map-transform'

const uppercase: Transformer = (_operands, _options) => (value, _context) =>
  mapAny(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    value
  )

export default uppercase
