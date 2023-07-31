import test from 'ava'

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

test('should return true when pattern match', async (t) => {
  const data = 'dimension101'
  const pattern = 'dimension\\d+'

  const ret = await patterns({ pattern })(options)(data, state)

  t.true(ret)
})

test('should return false when pattern does not match', async (t) => {
  const data = 'amount'
  const pattern = 'dimension\\d+'

  const ret = await patterns({ pattern })(options)(data, state)

  t.false(ret)
})

test('should apply pattern to value from path', async (t) => {
  const data = { id: 'dimension101', value: 'SE' }
  const path = 'id'
  const pattern = 'dimension\\d+'

  const ret = await patterns({ pattern, path })(options)(data, state)

  t.true(ret)
})

test('should support case insensitive flag', async (t) => {
  const data = 'Dimension101'
  const pattern = 'dimension\\d+'
  const caseinsensitive = true

  const ret = await patterns({ pattern, caseinsensitive })(options)(data, state)

  t.true(ret)
})

test('should return false data is not a string', async (t) => {
  const pattern = 'dimension\\d+'

  t.false(await patterns({ pattern })(options)({}, state))
  t.false(await patterns({ pattern })(options)(13, state))
  t.false(await patterns({ pattern })(options)(true, state))
  t.false(await patterns({ pattern })(options)(null, state))
  t.false(await patterns({ pattern })(options)(undefined, state))
})

test('should return false when no pattern', async (t) => {
  const data = 'amount'
  const pattern = undefined

  const ret = await patterns({ pattern })(options)(data, state)

  t.false(ret)
})
