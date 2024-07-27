import test from 'node:test'
import assert from 'node:assert/strict'

import number from './number.js'

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

test('should transform values to number', () => {
  assert.deepEqual(number(operands)(options)(12345, context), 12345)
  assert.deepEqual(number(operands)(options)(12.345, context), 12.345)
  assert.deepEqual(number(operands)(options)(12.899, context), 12.899)
  assert.deepEqual(number(operands)(options)('12345', context), 12345)
  assert.deepEqual(number(operands)(options)('12345.30', context), 12345.3)
  assert.deepEqual(number(operands)(options)('12345.30NUM', context), 12345.3)
  assert.deepEqual(number(operands)(options)('-35', context), -35)
  assert.deepEqual(number(operands)(options)(true, context), 1)
  assert.deepEqual(number(operands)(options)(false, context), 0)
})

test('should round number to given precision', () => {
  const operands = { precision: 2 }
  assert.deepEqual(number(operands)(options)(12345, context), 12345)
  assert.deepEqual(number(operands)(options)(12.345, context), 12.35)
  assert.deepEqual(number(operands)(options)(12.899, context), 12.9)
  assert.deepEqual(number(operands)(options)('12345', context), 12345)
  assert.deepEqual(number(operands)(options)('12345.345', context), 12345.35)
  assert.deepEqual(number(operands)(options)('12345.30NUM', context), 12345.3)
  assert.deepEqual(number(operands)(options)('-35.875', context), -35.87) // JS rounds 5 towards +∞
})

test('should round to integer', () => {
  const operands = { precision: 0 }
  assert.deepEqual(number(operands)(options)(12345, context), 12345)
  assert.deepEqual(number(operands)(options)(12.345, context), 12)
  assert.deepEqual(number(operands)(options)(12.899, context), 13)
  assert.deepEqual(number(operands)(options)('12345', context), 12345)
  assert.deepEqual(number(operands)(options)('12345.345', context), 12345)
  assert.deepEqual(number(operands)(options)('12345.30NUM', context), 12345)
  assert.deepEqual(number(operands)(options)('-35.875', context), -36)
})

test('should transform illegal values to undefined', () => {
  assert.deepEqual(
    number(operands)(options)('Not a number', context),
    undefined,
  )
  assert.deepEqual(number(operands)(options)('NUM12345.30', context), undefined)
  assert.deepEqual(number(operands)(options)({}, context), undefined)
  assert.deepEqual(
    number(operands)(options)({ id: '12345', title: 'Wrong' }, context),
    undefined,
  )
  assert.deepEqual(
    number(operands)(options)(new Date('Not a date'), context),
    undefined,
  )
  assert.deepEqual(number(operands)(options)(NaN, context), undefined)
})

test('should transform dates to ms number', () => {
  assert.deepEqual(
    number(operands)(options)(new Date('2019-05-22T13:43:11.345Z'), context),
    1558532591345,
  )
  assert.deepEqual(
    number(operands)(options)(
      new Date('2019-05-22T15:43:11.345+02:00'),
      context,
    ),
    1558532591345,
  )
})

test('should not touch null and undefined', () => {
  assert.deepEqual(number(operands)(options)(null, context), null)
  assert.deepEqual(number(operands)(options)(undefined, context), undefined)
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
    12345.3,
    12345.3,
    1,
    null,
    undefined,
    undefined,
    1558532591345,
    undefined,
  ]

  const ret = number(operands)(options)(value, context)

  assert.deepEqual(ret, expected)
})
