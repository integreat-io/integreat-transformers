import { sha256 } from '@noble/hashes/sha2.js'
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

// Convert Uint8Array to Base64 string
const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  // Use Buffer if available (Node.js), otherwise use btoa (browser)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  } else {
    return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))
  }
}

const hash: Transformer = () => () =>
  function hash(value) {
    if (value === null || value === undefined || value === '') {
      return value
    }

    const stringValue = String(value)
    const encoder = new TextEncoder()
    const data = encoder.encode(stringValue)
    const hashBytes = sha256(data)
    const base64Hash = uint8ArrayToBase64(hashBytes)

    return replaceReserved(base64Hash)
  }

export default hash
