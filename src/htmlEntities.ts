import he from 'he'
import { castString } from './string.js'
import type { Transformer } from 'integreat'

const decodeOptions = {}
const encodeOptions = { useNamedReferences: true, decimal: false }

const htmlEntities: Transformer = () => () => (value, state) => {
  const str = castString(value)
  if (typeof str !== 'string') {
    return undefined
  }

  return state.rev
    ? he.encode(str, encodeOptions)
    : he.decode(str, decodeOptions)
}

export default htmlEntities
