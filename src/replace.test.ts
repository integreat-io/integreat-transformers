import test from 'ava'

import replace from './replace.js'

// Setup

const options = {}
const context = {
  onlyMappedValues: false,
  context: [],
  value: {},
  rev: false,
}
const contextRev = {
  onlyMappedValues: false,
  context: [],
  value: {},
  rev: true,
}

// Tests

test('should replace from service', (t) => {
  const operands = { from: ':', to: '|' }
  const value = 'three:parts:here'
  const expected = 'three|parts|here'

  const ret = replace(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should replace to service', (t) => {
  const operands = { from: ':', to: '|' }
  const value = 'three|parts|here'
  const expected = 'three:parts:here'

  const ret = replace(operands)(options)(value, contextRev)

  t.is(ret, expected)
})

test('should replace from service in array', (t) => {
  const operands = { from: ':', to: '|' }
  const value = ['three:parts:here']
  const expected = ['three|parts|here']

  const ret = replace(operands)(options)(value, context)

  t.deepEqual(ret, expected)
})

test('should replace to service in array', (t) => {
  const operands = { from: ':', to: '|' }
  const value = ['three|parts|here']
  const expected = ['three:parts:here']

  const ret = replace(operands)(options)(value, contextRev)

  t.deepEqual(ret, expected)
})

test('should do nothing when operands are missing', (t) => {
  const operands = {}
  const value = 'three:parts:here'
  const expected = value

  const ret = replace(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should not touch no-strings', (t) => {
  const operands = { from: ':', to: '|' }

  t.is(replace(operands)(options)(3, context), 3)
  t.deepEqual(replace(operands)(options)({}, context), {})
  t.is(replace(operands)(options)(null, context), null)
  t.is(replace(operands)(options)(undefined, context), undefined)
})
