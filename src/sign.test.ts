import test from 'node:test'
import assert from 'node:assert/strict'

import sign from './sign.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return 1 for a positive number', () => {
  const value = 5
  const expected = 1
  const ret = sign({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return -1 for a negative number', () => {
  const value = -5
  const expected = -1
  const ret = sign({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return 0 for zero', () => {
  const value = 0
  const expected = 0
  const ret = sign({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return 1 for a positive float', () => {
  const value = 5.345
  const expected = 1
  const ret = sign({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return -1 for a negative float', () => {
  const value = -5.345
  const expected = -1
  const ret = sign({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return -1 when value string can be parsed to a negative num', () => {
  const value = '-5'
  const expected = -1
  const ret = sign({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return undefined for non-parsable strings', () => {
  const value = 'test'
  const expected = undefined
  const ret = sign({})(options)(value, state)

  assert.equal(ret, expected)
})
