import test from 'node:test'
import assert from 'node:assert/strict'

import boolean from './boolean.js'

// Setup

const operands = {}
const options = {}
const context = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should transform values to boolean', () => {
  assert.equal(boolean(operands)(options)(true, context), true)
  assert.equal(boolean(operands)(options)(false, context), false)
  assert.equal(boolean(operands)(options)('true', context), true)
  assert.equal(boolean(operands)(options)('false', context), false)
  assert.equal(boolean(operands)(options)(1, context), true)
  assert.equal(boolean(operands)(options)(0, context), false)
})

test('should not touch null and undefined', () => {
  assert.deepEqual(boolean(operands)(options)(null, context), null)
  assert.deepEqual(boolean(operands)(options)(undefined, context), undefined)
})

test('should iterate array', () => {
  const value = [true, false, 'true', 'false', 1, 0, undefined, null]
  const expected = [true, false, true, false, true, false, undefined, null]

  const ret = boolean(operands)(options)(value, context)

  assert.deepEqual(ret, expected)
})
