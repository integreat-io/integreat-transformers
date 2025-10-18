import { sha256 } from '@noble/hashes/sha2.js'

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  // Use Buffer if available (Node.js), otherwise use btoa (browser)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  } else {
    return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))
  }
}

export function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function hashString(value: string): Uint8Array {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  return sha256(data)
}
