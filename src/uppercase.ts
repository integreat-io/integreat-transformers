import mapAny from 'map-any'
import type { Transformer } from 'integreat'

const uppercase: Transformer = () => () => (value) =>
  mapAny(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    value
  )

export default uppercase
