import mapAny from 'map-any'
import { castString } from './string.js'
import xor from './utils/xor.js'
import type { Transformer } from 'integreat'

function encode(data: unknown) {
  const str = castString(data)
  if (typeof str !== 'string') {
    return str // null or undefined
  }
  return Buffer.from(str).toString('base64')
}

function decode(data: unknown) {
  if (typeof data !== 'string') {
    return data === null ? null : undefined
  }
  return Buffer.from(data, 'base64').toString()
}

export const base64Decode: Transformer = () => () => (data, _state) =>
  decode(data)

export const base64Encode: Transformer = () => () => (data, _state) =>
  encode(data)

const transformer: Transformer = () => () => (data, state) =>
  xor(state.rev, state.flip) ? mapAny(encode)(data) : mapAny(decode)(data)

export default transformer
