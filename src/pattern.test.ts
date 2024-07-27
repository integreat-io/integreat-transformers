import test from 'node:test'
import assert from 'node:assert/strict'

import patterns from './pattern.js'

// Setup

const options = {}
const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return true when pattern match', async () => {
  const data = 'dimension101'
  const pattern = 'dimension\\d+'

  const ret = await patterns({ pattern })(options)(data, state)

  assert.equal(ret, true)
})

test('should return false when pattern does not match', async () => {
  const data = 'amount'
  const pattern = 'dimension\\d+'

  const ret = await patterns({ pattern })(options)(data, state)

  assert.equal(ret, false)
})

test('should apply pattern to value from path', async () => {
  const data = { id: 'dimension101', value: 'SE' }
  const path = 'id'
  const pattern = 'dimension\\d+'

  const ret = await patterns({ pattern, path })(options)(data, state)

  assert.equal(ret, true)
})

test('should support case insensitive flag', async () => {
  const data = 'Dimension101'
  const pattern = 'dimension\\d+'
  const caseinsensitive = true

  const ret = await patterns({ pattern, caseinsensitive })(options)(data, state)

  assert.equal(ret, true)
})

test('should return false data is not a string', async () => {
  const pattern = 'dimension\\d+'

  assert.equal(await patterns({ pattern })(options)({}, state), false)
  assert.equal(await patterns({ pattern })(options)(13, state), false)
  assert.equal(await patterns({ pattern })(options)(true, state), false)
  assert.equal(await patterns({ pattern })(options)(null, state), false)
  assert.equal(await patterns({ pattern })(options)(undefined, state), false)
})

test('should return false when no pattern', async () => {
  const data = 'amount'
  const pattern = undefined

  const ret = await patterns({ pattern })(options)(data, state)

  assert.equal(ret, false)
})
