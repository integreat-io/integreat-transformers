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

test('should return true when pattern match', (t) => {
  const data = 'dimension101'
  const pattern = 'dimension\\d+'

  const ret = patterns({ pattern })(options)(data, state)

  t.true(ret)
})

test('should return false when pattern does not match', (t) => {
  const data = 'amount'
  const pattern = 'dimension\\d+'

  const ret = patterns({ pattern })(options)(data, state)

  t.false(ret)
})

test('should apply pattern to value from path', (t) => {
  const data = { id: 'dimension101', value: 'SE' }
  const path = 'id'
  const pattern = 'dimension\\d+'

  const ret = patterns({ pattern, path })(options)(data, state)

  t.true(ret)
})

test('should support case insensitive flag', (t) => {
  const data = 'Dimension101'
  const pattern = 'dimension\\d+'
  const caseinsensitive = true

  const ret = patterns({ pattern, caseinsensitive })(options)(data, state)

  t.true(ret)
})

test('should return false data is not a string', (t) => {
  const pattern = 'dimension\\d+'

  t.false(patterns({ pattern })(options)({}, state))
  t.false(patterns({ pattern })(options)(13, state))
  t.false(patterns({ pattern })(options)(true, state))
  t.false(patterns({ pattern })(options)(null, state))
  t.false(patterns({ pattern })(options)(undefined, state))
})

test('should return false when no pattern', (t) => {
  const data = 'amount'
  const pattern = undefined

  const ret = patterns({ pattern })(options)(data, state)

  t.false(ret)
})
