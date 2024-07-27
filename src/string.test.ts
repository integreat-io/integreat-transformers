import test from 'node:test'
import assert from 'node:assert/strict'

import stringFn from './string.js'

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

test('should transform values to string', () => {
  assert.deepEqual(stringFn(operands)(options)('A string', context), 'A string')
  assert.deepEqual(stringFn(operands)(options)(12345, context), '12345')
  assert.deepEqual(stringFn(operands)(options)(12.345, context), '12.345')
  assert.deepEqual(stringFn(operands)(options)(true, context), 'true')
  assert.deepEqual(stringFn(operands)(options)(false, context), 'false')
})

test('should transform dates to iso string', () => {
  assert.deepEqual(
    stringFn(operands)(options)(new Date('2019-05-22T13:43:11.345Z'), context),
    '2019-05-22T13:43:11.345Z',
  )
  assert.deepEqual(
    stringFn(operands)(options)(
      new Date('2019-05-22T15:43:11.345+02:00'),
      context,
    ),
    '2019-05-22T13:43:11.345Z',
  )
})

test('should transform objects to undefined', () => {
  assert.deepEqual(stringFn(operands)(options)({}, context), undefined)
  assert.deepEqual(
    stringFn(operands)(options)({ id: '12345', title: 'Wrong' }, context),
    undefined,
  )
})

test('should not touch null and undefined', () => {
  assert.deepEqual(stringFn(operands)(options)(null, context), null)
  assert.deepEqual(stringFn(operands)(options)(undefined, context), undefined)
})

test('should iterate arrays', () => {
  const value = [
    'A string',
    12345,
    true,
    null,
    undefined,
    new Date('2019-05-22T13:43:11.345Z'),
    {},
  ]
  const expected = [
    'A string',
    '12345',
    'true',
    null,
    undefined,
    '2019-05-22T13:43:11.345Z',
    undefined,
  ]

  const ret = stringFn(operands)(options)(value, context)

  assert.deepEqual(ret, expected)
})
