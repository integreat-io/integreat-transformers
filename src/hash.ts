import type { AsyncTransformer } from 'map-transform/types.js'

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

// Convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)

  // Use Buffer if available (Node.js), otherwise use btoa (browser)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  } else {
    return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))
  }
}

const hash: AsyncTransformer = () => () =>
  async function hash(value) {
    if (value === null || value === undefined || value === '') {
      return value
    }

    const stringValue = String(value)
    const encoder = new TextEncoder()
    const data = encoder.encode(stringValue)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const base64Hash = arrayBufferToBase64(hashBuffer)

    return replaceReserved(base64Hash)
  }

export default hash
