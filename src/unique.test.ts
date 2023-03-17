import test from 'ava'

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

test('should return unique string', (t) => {
  const ret1 = unique({})(options)(undefined, state)
  const ret2 = unique({})(options)(undefined, state)

  t.is(typeof ret1, 'string')
  t.is(typeof ret2, 'string')
  t.not(ret1, ret2)
})

test('should return uuid in lowercase', (t) => {
  const ret1 = unique({ type: 'uuid' })(options)(undefined, state)
  const ret2 = unique({ type: 'uuid' })(options)(undefined, state)

  t.regex(
    ret1 as string,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  )
  t.regex(
    ret2 as string,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  )
  t.not(ret1, ret2)
})

test('should return uuid in lowercase when using alias', (t) => {
  const ret1 = unique({ type: 'uuidLower' })(options)(undefined, state)
  const ret2 = unique({ type: 'uuidLower' })(options)(undefined, state)

  t.regex(
    ret1 as string,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  )
  t.regex(
    ret2 as string,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  )
  t.not(ret1, ret2)
})

test('should return uuid in uppercase', (t) => {
  const ret1 = unique({ type: 'uuidUpper' })(options)(undefined, state)
  const ret2 = unique({ type: 'uuidUpper' })(options)(undefined, state)

  t.regex(
    ret1 as string,
    /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/
  )
  t.regex(
    ret2 as string,
    /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/
  )
  t.not(ret1, ret2)
})

test('should return unique string in rev', (t) => {
  const ret1 = unique({})(options)(undefined, stateRev)
  const ret2 = unique({})(options)(undefined, stateRev)

  t.is(typeof ret1, 'string')
  t.is(typeof ret2, 'string')
  t.not(ret1, ret2)
})
