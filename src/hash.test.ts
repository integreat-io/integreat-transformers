import test from 'node:test'
import assert from 'node:assert/strict'

import hash from './hash.js'

// Setup

const operands = {}
const options = {}
const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return hashed string', async () => {
  const unhashed = 'https://test.com/a/long/path?with=queries'
  const expected = '9prI09j7pPp9qkyZAO1EwN7kWT2r-g_dCI7HeD_Tdgw~'

  const ret = await hash(operands)(options)(unhashed, state)

  assert.deepEqual(ret, expected)
})

test('should return null when given null', async () => {
  const ret = await hash(operands)(options)(null, state)

  assert.deepEqual(ret, null)
})

test('should return undefined when given null', async () => {
  const ret = await hash(operands)(options)(undefined, state)

  assert.deepEqual(ret, undefined)
})

test('should return empty string when given empty string', async () => {
  const ret = await hash(operands)(options)('', state)

  assert.deepEqual(ret, '')
})

test('should treat number as a string', async () => {
  const unhashed = 42
  const expected = 'c0dctApWjo2ooEXO0RATfhWfiQrE2og7axfcZRs6gEk~'

  const ret = await hash(operands)(options)(unhashed, state)

  assert.deepEqual(ret, expected)
})

test('should return hashed string using browser path', async () => {
  const unhashed = 'https://test.com/a/long/path?with=queries'
  const expected = '9prI09j7pPp9qkyZAO1EwN7kWT2r-g_dCI7HeD_Tdgw~'

  // Store original values to restore later
  const originalBuffer = globalThis.Buffer
  const originalBtoa = globalThis.btoa

  try {
    // Simulate browser environment by removing Buffer
    // Intentionally removing Buffer to force browser code path
    delete (globalThis as { Buffer?: typeof Buffer }).Buffer

    // Provide btoa implementation (standard browser API for base64 encoding)
    globalThis.btoa = (str: string): string => {
      // Web standard base64 encoding implementation
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      let result = ''
      let i = 0

      while (i < str.length) {
        const a = str.charCodeAt(i++)
        const b = i < str.length ? str.charCodeAt(i++) : 0
        const c = i < str.length ? str.charCodeAt(i++) : 0

        const bitmap = (a << 16) | (b << 8) | c

        result += chars.charAt((bitmap >> 18) & 63)
        result += chars.charAt((bitmap >> 12) & 63)
        result += i - 1 < str.length ? chars.charAt((bitmap >> 6) & 63) : '='
        result += i - 0 < str.length ? chars.charAt(bitmap & 63) : '='
      }

      return result
    }

    // This should now use the browser code path in arrayBufferToBase64()
    const ret = await hash(operands)(options)(unhashed, state)
    assert.deepEqual(ret, expected)
  } finally {
    // Restore original Node.js environment
    globalThis.Buffer = originalBuffer
    if (originalBtoa !== undefined) {
      globalThis.btoa = originalBtoa
    } else {
      delete (globalThis as { btoa?: typeof btoa }).btoa
    }
  }
})
