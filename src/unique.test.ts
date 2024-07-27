import test from 'node:test'
import assert from 'node:assert/strict'

import unique from './unique.js'

// Setup

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}
const stateRev = {
  rev: true,
  onlyMappedValues: false,
  context: [],
  value: {},
}

const options = {}

// Tests

test('should return unique string', () => {
  const ret1 = unique({})(options)(undefined, state)
  const ret2 = unique({})(options)(undefined, state)

  assert.equal(typeof ret1, 'string')
  assert.equal(typeof ret2, 'string')
  assert.match(ret1 as string, /^[a-zA-Z0-9_-]{21}$/)
  assert.match(ret2 as string, /^[a-zA-Z0-9_-]{21}$/)
  assert.notEqual(ret1, ret2)
})

test('should return unique string with only alphanumeric characters', () => {
  const ret1 = unique({ type: 'alpha' })(options)(undefined, state)
  const ret2 = unique({ type: 'alpha' })(options)(undefined, state)

  assert.match(ret1 as string, /^[a-zA-Z0-9]{21}$/)
  assert.match(ret2 as string, /^[a-zA-Z0-9]{21}$/)
  assert.notEqual(ret1, ret2)
})

test('should return uuid in lowercase', () => {
  const ret1 = unique({ type: 'uuid' })(options)(undefined, state)
  const ret2 = unique({ type: 'uuid' })(options)(undefined, state)

  assert.match(
    ret1 as string,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  )
  assert.match(
    ret2 as string,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  )
  assert.notEqual(ret1, ret2)
})

test('should return uuid in lowercase when using alias', () => {
  const ret1 = unique({ type: 'uuidLower' })(options)(undefined, state)
  const ret2 = unique({ type: 'uuidLower' })(options)(undefined, state)

  assert.match(
    ret1 as string,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  )
  assert.match(
    ret2 as string,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  )
  assert.notEqual(ret1, ret2)
})

test('should return uuid in uppercase', () => {
  const ret1 = unique({ type: 'uuidUpper' })(options)(undefined, state)
  const ret2 = unique({ type: 'uuidUpper' })(options)(undefined, state)

  assert.match(
    ret1 as string,
    /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/,
  )
  assert.match(
    ret2 as string,
    /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/,
  )
  assert.notEqual(ret1, ret2)
})

test('should return unique string in rev', () => {
  const ret1 = unique({})(options)(undefined, stateRev)
  const ret2 = unique({})(options)(undefined, stateRev)

  assert.deepEqual(typeof ret1, 'string')
  assert.deepEqual(typeof ret2, 'string')
  assert.notEqual(ret1, ret2)
})
