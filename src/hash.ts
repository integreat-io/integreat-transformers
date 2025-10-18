import { hashString, uint8ArrayToBase64 } from './utils/hash.js'
import type { Transformer } from 'map-transform/types.js'

const replaceRegex = /[+/=]/g

const replaceReserved = (hash: string) => {
  return hash.replace(replaceRegex, (match: string) => {
    switch (match) {
      case '+':
        return '-'
      case '/':
        return '_'
      case '=':
        return '~'
      default:
        return match
    }
  })
}

const hash: Transformer = () => () =>
  function hash(value) {
    if (value === null || value === undefined || value === '') {
      return value
    }

    const hashed = hashString(String(value))
    const base64ed = uint8ArrayToBase64(hashed)
    return replaceReserved(base64ed)
  }

export default hash
