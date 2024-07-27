import test from 'node:test'
import assert from 'node:assert/strict'

import ms from './ms.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should convert Date to milliseconds', () => {
  const value = new Date('2022-01-13T14:58:46.975Z')
  const expected = 1642085926975

  const ret = ms({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should convert date string to milliseconds', () => {
  const value = '2022-01-13T14:58:46.975Z'
  const expected = 1642085926975

  const ret = ms({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return milliseconds as milliseconds', () => {
  const value = 1642085926975
  const expected = 1642085926975

  const ret = ms({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined when not ms or Date', () => {
  assert.deepEqual(ms({})(options)('Hello', state), undefined)
  assert.deepEqual(ms({})(options)({}, state), undefined)
  assert.deepEqual(ms({})(options)(true, state), undefined)
  assert.deepEqual(ms({})(options)(null, state), undefined)
  assert.deepEqual(ms({})(options)(undefined, state), undefined)
})
