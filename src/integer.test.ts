import test from 'node:test'
import assert from 'node:assert/strict'

import integer from './integer.js'

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

test('should transform values to integer', () => {
  assert.deepEqual(integer(operands)(options)(12345, context), 12345)
  assert.deepEqual(integer(operands)(options)(12.345, context), 12)
  assert.deepEqual(integer(operands)(options)(12.899, context), 13)
  assert.deepEqual(integer(operands)(options)('12345', context), 12345)
  assert.deepEqual(integer(operands)(options)('12345.345', context), 12345)
  assert.deepEqual(integer(operands)(options)('12345.30NUM', context), 12345)
  assert.deepEqual(integer(operands)(options)('-35.1', context), -35)
  assert.deepEqual(integer(operands)(options)('-35.875', context), -36)
  assert.deepEqual(integer(operands)(options)(true, context), 1)
  assert.deepEqual(integer(operands)(options)(false, context), 0)
})

test('should transform illegal values to undefined', () => {
  assert.deepEqual(
    integer(operands)(options)('Not a number', context),
    undefined,
  )
  assert.deepEqual(
    integer(operands)(options)('NUM12345.30', context),
    undefined,
  )
  assert.deepEqual(integer(operands)(options)({}, context), undefined)
  assert.deepEqual(
    integer(operands)(options)({ id: '12345', title: 'Wrong' }, context),
    undefined,
  )
  assert.deepEqual(
    integer(operands)(options)(new Date('Not a date'), context),
    undefined,
  )
  assert.deepEqual(integer(operands)(options)(NaN, context), undefined)
})

test('should transform dates to ms number', () => {
  assert.deepEqual(
    integer(operands)(options)(new Date('2019-05-22T13:43:11.345Z'), context),
    1558532591345,
  )
  assert.deepEqual(
    integer(operands)(options)(
      new Date('2019-05-22T15:43:11.345+02:00'),
      context,
    ),
    1558532591345,
  )
})

test('should not touch null and undefined', () => {
  assert.deepEqual(integer(operands)(options)(null, context), null)
  assert.deepEqual(integer(operands)(options)(undefined, context), undefined)
})

test('should iterate arrays', () => {
  const value = [
    12345.3,
    '12345.30',
    true,
    null,
    'A string',
    undefined,
    new Date('2019-05-22T13:43:11.345Z'),
    {},
  ]
  const expected = [
    12345,
    12345,
    1,
    null,
    undefined,
    undefined,
    1558532591345,
    undefined,
  ]

  const ret = integer(operands)(options)(value, context)

  assert.deepEqual(ret, expected)
})
