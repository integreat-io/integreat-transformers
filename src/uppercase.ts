import type { Transformer } from 'integreat'
import mapAny = require('map-any')

const uppercase: Transformer = () => () => (value) =>
  mapAny(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    value
  )

export default uppercase
