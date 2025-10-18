import he from 'he'
import { castString } from './string.js'
import xor from './utils/xor.js'
import type { Transformer } from 'map-transform/types.js'

const decodeOptions = {}
const encodeOptions = { useNamedReferences: true, decimal: false }

const htmlEntities =
  (encodeFwd: boolean): Transformer =>
  () =>
  () =>
  (value, state) => {
    const str = castString(value)
    if (typeof str !== 'string') {
      return undefined
    }

    return xor(state.rev, encodeFwd)
      ? he.encode(str, encodeOptions)
      : he.decode(str, decodeOptions)
  }

export const htmlDecode: Transformer = htmlEntities(false)
export const htmlEncode: Transformer = htmlEntities(true)
