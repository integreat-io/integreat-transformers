import test from 'node:test'
import assert from 'node:assert/strict'

import lowercase from './lowercase.js'

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

test('should return uppercase', () => {
  const value = 'JULESTJERNE'
  const expected = 'julestjerne'

  const ret = lowercase(operands)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return null when null', () => {
  const ret = lowercase(operands)(options)(null, state)

  assert.deepEqual(ret, null)
})

test('should iterate array', () => {
  const value = ['JULESTJERNE', 'PÅSKELILJE', undefined]
  const expected = ['julestjerne', 'påskelilje', undefined]

  const ret = lowercase(operands)(options)(value, state)

  assert.deepEqual(ret, expected)
})
