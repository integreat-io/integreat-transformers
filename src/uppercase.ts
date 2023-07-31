import mapAny from 'map-any'
import type { Transformer } from 'map-transform/types.js'

const toUpper = (value: unknown) => (typeof value === 'string' ? value.toUpperCase() : value)

const uppercase: Transformer = () => () => (value) =>
  mapAny(toUpper)(value)

export default uppercase
