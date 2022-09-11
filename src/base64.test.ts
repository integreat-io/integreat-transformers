import test from 'ava'

import base64 from './base64'

// Setup

const operands = {}
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

test('should decode base64 from service', (t) => {
  const data = 'c29tZVRva2Vu'
  const expected = 'someToken'

  const ret = base64(operands, options)(data, context)

  t.is(ret, expected)
})

test('should encode base64 to service', (t) => {
  const data = 'someToken'
  const expected = 'c29tZVRva2Vu'

  const ret = base64(operands, options)(data, contextRev)

  t.is(ret, expected)
})

test('should decode base64 array from service', (t) => {
  const data = ['c29tZVRva2Vu']
  const expected = ['someToken']

  const ret = base64(operands, options)(data, context)

  t.deepEqual(ret, expected)
})

test('should encode base64 array to service', (t) => {
  const data = ['someToken']
  const expected = ['c29tZVRva2Vu']

  const ret = base64(operands, options)(data, contextRev)

  t.deepEqual(ret, expected)
})

test('should return undefined or null when not a string from service', (t) => {
  t.is(base64(operands, options)({}, context), undefined)
  t.is(base64(operands, options)(null, context), null)
  t.is(base64(operands, options)(undefined, context), undefined)
})

test('should return undefined or null when not a string to service', (t) => {
  t.is(base64(operands, options)({}, contextRev), undefined)
  t.is(base64(operands, options)(null, contextRev), null)
  t.is(base64(operands, options)(undefined, contextRev), undefined)
})

test('should force values to string to service', (t) => {
  t.is(base64(operands, options)(3, contextRev), 'Mw==')
  t.is(
    base64(operands, options)(new Date('2022-01-03T18:43:11Z'), contextRev),
    'MjAyMi0wMS0wM1QxODo0MzoxMS4wMDBa'
  )
  t.is(base64(operands, options)(true, contextRev), 'dHJ1ZQ==')
})
