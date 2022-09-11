import { Transformer } from 'integreat'
import mapAny = require('map-any')
import { castString } from './string'

function base64Encode(data: unknown) {
  const str = castString(data)
  if (typeof str !== 'string') {
    return str // null or undefined
  }
  return Buffer.from(str).toString('base64')
}

function base64Decode(data: unknown) {
  if (typeof data !== 'string') {
    return data === null ? null : undefined
  }
  return Buffer.from(data, 'base64').toString()
}

const transformer: Transformer = () => (data, state) =>
  state.rev ? mapAny(base64Encode, data) : mapAny(base64Decode, data)

export default transformer
