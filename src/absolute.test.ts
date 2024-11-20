import test from 'node:test'
import assert from 'node:assert/strict'

import absolute from './absolute.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return positive value from a postitive', () => {
  const value = 5
  const expected = 5
  const ret = absolute({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return positive value from a negative', () => {
  const value = -5
  const expected = 5
  const ret = absolute({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return positive float from a negative', () => {
  const value = -5.345
  const expected = 5.345
  const ret = absolute({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return undefined when value is not a number', () => {
  const value = '5'
  const expected = undefined
  const ret = absolute({})(options)(value, state)

  assert.equal(ret, expected)
})
