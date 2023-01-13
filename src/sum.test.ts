import test from 'ava'

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

test('should summarize an array of numbers', (t) => {
  const data = [-1, 3, 2.5, 14]
  const expected = 18.5

  const ret = sum(operands, options)(data, context)

  t.is(ret, expected)
})

test('should extract numbers from string', (t) => {
  const data = ['-1', 3, '2.5', '14']
  const expected = 18.5

  const ret = sum(operands, options)(data, context)

  t.is(ret, expected)
})

test('should skip non-numerics', (t) => {
  const data = ['here:', 3, '2.5', undefined, null, new Date(), 14]
  const expected = 19.5

  const ret = sum(operands, options)(data, context)

  t.is(ret, expected)
})

test('should return one number', (t) => {
  const data = 14
  const expected = 14

  const ret = sum(operands, options)(data, context)

  t.is(ret, expected)
})

test('should extract number from one string', (t) => {
  const data = '14'
  const expected = 14

  const ret = sum(operands, options)(data, context)

  t.is(ret, expected)
})

test('should return 0 for non-numbers', (t) => {
  t.is(sum(operands, options)('hello?', context), 0)
  t.is(sum(operands, options)(new Date(), context), 0)
  t.is(sum(operands, options)(true, context), 0)
  t.is(sum(operands, options)(null, context), 0)
  t.is(sum(operands, options)(undefined, context), 0)
})
