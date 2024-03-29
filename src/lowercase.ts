import mapAny from 'map-any'
import type { Transformer } from 'integreat'

const toLower = (value: unknown) => (typeof value === 'string' ? value.toLowerCase() : value)

const lowercase: Transformer = () => () => (value) =>
  mapAny(toLower)(value)

export default lowercase
