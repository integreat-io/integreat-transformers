import { Transformer } from 'integreat'
import mapAny = require('map-any')

const castBoolean = (value: unknown) => {
  if (value === null || value === undefined) {
    return value
  } else {
    return value === 'false' ? false : Boolean(value)
  }
}

const transformer: Transformer = () => mapAny(castBoolean)

export default transformer
