import test from 'node:test'
import assert from 'node:assert/strict'

import uppercase from './uppercase.js'

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

test('should return uppercase)', () => {
  const value = 'julestjerne'
  const expected = 'JULESTJERNE'

  const ret = uppercase(operands)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return null when null', () => {
  const ret = uppercase(operands)(options)(null, state)

  assert.deepEqual(ret, null)
})

test('should iterate array', () => {
  const value = ['julestjerne', 'påskelilje', undefined]
  const expected = ['JULESTJERNE', 'PÅSKELILJE', undefined]

  const ret = uppercase(operands)(options)(value, state)

  assert.deepEqual(ret, expected)
})
