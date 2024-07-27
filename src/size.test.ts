import test from 'node:test'
import assert from 'node:assert/strict'

import size from './size.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return size of a string', () => {
  const value = 'A string of 25 characters'
  const expected = 25

  const ret = size({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return size of an array', () => {
  const value = ['Array', 'of', 5, 'strings', 'and', 2, 'numbers']
  const expected = 7

  const ret = size({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return size of a number', () => {
  const value = 1000000
  const expected = 7

  const ret = size({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return size of a number with decimals', () => {
  const value = 0.35
  const expected = 4

  const ret = size({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return 1 for primitive values and objects', () => {
  assert.deepEqual(size({})(options)(true, state), 1)
  assert.deepEqual(size({})(options)({}, state), 1)
  assert.deepEqual(size({})(options)(new Date(), state), 1)
})

test('should return 0 for null and undefined', () => {
  assert.deepEqual(size({})(options)(null, state), 0)
  assert.deepEqual(size({})(options)(undefined, state), 0)
})
