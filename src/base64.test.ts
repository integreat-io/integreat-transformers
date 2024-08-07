import test from 'node:test'
import assert from 'node:assert/strict'

import base64, { base64Decode, base64Encode } from './base64.js'

// Setup

const operands = {}
const options = {}
const state = {
  onlyMappedValues: false,
  context: [],
  value: {},
  rev: false,
}
const stateRev = {
  onlyMappedValues: false,
  context: [],
  value: {},
  rev: true,
}

// Tests -- base64

test('should decode base64 from service', () => {
  const data = 'c29tZVRva2Vu'
  const expected = 'someToken'

  const ret = base64(operands)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should encode base64 to service', () => {
  const data = 'someToken'
  const expected = 'c29tZVRva2Vu'

  const ret = base64(operands)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should decode base64 array from service', () => {
  const data = ['c29tZVRva2Vu']
  const expected = ['someToken']

  const ret = base64(operands)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should encode base64 array to service', () => {
  const data = ['someToken']
  const expected = ['c29tZVRva2Vu']

  const ret = base64(operands)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should decode base64 to service when flipped', () => {
  const stateFlipped = { ...stateRev, flip: true }
  const data = 'c29tZVRva2Vu'
  const expected = 'someToken'

  const ret = base64(operands)(options)(data, stateFlipped)

  assert.deepEqual(ret, expected)
})

test('should return undefined or null when not a string from service', () => {
  assert.deepEqual(base64(operands)(options)({}, state), undefined)
  assert.deepEqual(base64(operands)(options)(null, state), null)
  assert.deepEqual(base64(operands)(options)(undefined, state), undefined)
})

test('should return undefined or null when not a string to service', () => {
  assert.deepEqual(base64(operands)(options)({}, stateRev), undefined)
  assert.deepEqual(base64(operands)(options)(null, stateRev), null)
  assert.deepEqual(base64(operands)(options)(undefined, stateRev), undefined)
})

test('should force values to string to service', () => {
  assert.deepEqual(base64(operands)(options)(3, stateRev), 'Mw==')
  assert.deepEqual(
    base64(operands)(options)(new Date('2022-01-03T18:43:11Z'), stateRev),
    'MjAyMi0wMS0wM1QxODo0MzoxMS4wMDBa',
  )
  assert.deepEqual(base64(operands)(options)(true, stateRev), 'dHJ1ZQ==')
})

// Tests -- base64Decode

test('should decode base64 regardless of direction', () => {
  const data = 'c29tZVRva2Vu'
  const expected = 'someToken'

  const ret = base64Decode(operands)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

// Tests -- base64Encode

test('should encode base64 regardless of direction', () => {
  const data = 'someToken'
  const expected = 'c29tZVRva2Vu'

  const ret = base64Encode(operands)(options)(data, state)

  assert.deepEqual(ret, expected)
})
