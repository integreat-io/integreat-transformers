import mapAny from 'map-any'
import type { Transformer } from 'integreat'

const castBoolean = (value: unknown) => {
  if (value === null || value === undefined) {
    return value
  } else {
    return value === 'false' ? false : Boolean(value)
  }
}

const transformer: Transformer = () => () => mapAny(castBoolean)

export default transformer
