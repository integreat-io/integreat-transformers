import mapAny from 'map-any'
import type { Transformer } from 'integreat'

const lowercase: Transformer = () => () => (value) =>
  mapAny(
    (value) => (typeof value === 'string' ? value.toLowerCase() : value),
    value
  )

export default lowercase
