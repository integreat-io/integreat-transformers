import test from 'ava'

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

test('should return size of a string', (t) => {
  const value = 'A string of 25 characters'
  const expected = 25

  const ret = size({})(options)(value, state)

  t.is(ret, expected)
})

test('should return size of an array', (t) => {
  const value = ['Array', 'of', 5, 'strings', 'and', 2, 'numbers']
  const expected = 7

  const ret = size({})(options)(value, state)

  t.is(ret, expected)
})

test('should return size of a number', (t) => {
  const value = 1000000
  const expected = 7

  const ret = size({})(options)(value, state)

  t.is(ret, expected)
})

test('should return size of a number with decimals', (t) => {
  const value = 0.35
  const expected = 4

  const ret = size({})(options)(value, state)

  t.is(ret, expected)
})

test('should return 1 for primitive values and objects', (t) => {
  t.is(size({})(options)(true, state), 1)
  t.is(size({})(options)({}, state), 1)
  t.is(size({})(options)(new Date(), state), 1)
})

test('should return 0 for null and undefined', (t) => {
  t.is(size({})(options)(null, state), 0)
  t.is(size({})(options)(undefined, state), 0)
})
