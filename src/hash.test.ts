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

test('should return hashed string', () => {
  const unhashed = 'https://test.com/a/long/path?with=queries'
  const expected = '9prI09j7pPp9qkyZAO1EwN7kWT2r-g_dCI7HeD_Tdgw~'

  const ret = hash(operands)(options)(unhashed, state)

  assert.deepEqual(ret, expected)
})

test('should return null when given null', () => {
  const ret = hash(operands)(options)(null, state)

  assert.deepEqual(ret, null)
})

test('should return undefined when given null', () => {
  const ret = hash(operands)(options)(undefined, state)

  assert.deepEqual(ret, undefined)
})

test('should return empty string when given empty string', () => {
  const ret = hash(operands)(options)('', state)

  assert.deepEqual(ret, '')
})

test('should treat number as a string', () => {
  const unhashed = 42
  const expected = 'c0dctApWjo2ooEXO0RATfhWfiQrE2og7axfcZRs6gEk~'

  const ret = hash(operands)(options)(unhashed, state)

  assert.deepEqual(ret, expected)
})
