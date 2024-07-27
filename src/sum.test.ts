import test from 'node:test'
import assert from 'node:assert/strict'

import sum from './sum.js'

// Setup

const operands = {}
const options = {}
const context = {
  onlyMappedValues: false,
  context: [],
  value: {},
  rev: false,
}

// Tests

test('should summarize an array of numbers', () => {
  const data = [-1, 3, 2.5, 14]
  const expected = 18.5

  const ret = sum(operands)(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should extract numbers from string', () => {
  const data = ['-1', 3, '2.5', '14']
  const expected = 18.5

  const ret = sum(operands)(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should skip non-numerics', () => {
  const data = ['here:', 3, '2.5', undefined, null, new Date(), 14]
  const expected = 19.5

  const ret = sum(operands)(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should return one number', () => {
  const data = 14
  const expected = 14

  const ret = sum(operands)(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should extract number from one string', () => {
  const data = '14'
  const expected = 14

  const ret = sum(operands)(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should return 0 for non-numbers', () => {
  assert.deepEqual(sum(operands)(options)('hello?', context), 0)
  assert.deepEqual(sum(operands)(options)(new Date(), context), 0)
  assert.deepEqual(sum(operands)(options)(true, context), 0)
  assert.deepEqual(sum(operands)(options)(null, context), 0)
  assert.deepEqual(sum(operands)(options)(undefined, context), 0)
})
