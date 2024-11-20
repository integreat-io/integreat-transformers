import test from 'node:test'
import assert from 'node:assert/strict'

import extractNumber from './extractNumber.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return a number from a string starting with a number', () => {
  const value = '12345test'
  const expected = 12345
  const ret = extractNumber({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return a number from a string ending with a number', () => {
  const value = 'test12345'
  const expected = 12345
  const ret = extractNumber({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return a number from a string with numbers throughout', () => {
  const value = '1t2es345t'
  const expected = 12345
  const ret = extractNumber({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return a number from number', () => {
  const value = 12345
  const expected = 12345
  const ret = extractNumber({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return undefined from a string with no numbers', () => {
  const value = 'test'
  const expected = undefined
  const ret = extractNumber({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return undefined when not string or number', () => {
  const value = {}
  const expected = undefined
  const ret = extractNumber({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return a float when value is a float', () => {
  const value = 5.2642
  const expected = 5.2642
  const ret = extractNumber({})(options)(value, state)

  assert.equal(ret, expected)
})
