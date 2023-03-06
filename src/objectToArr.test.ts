import test from 'ava'

import objectToArr from './objectToArr.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

const stateRev = { ...state, rev: true }

// Tests -- forward

test('should extract the values on an object to an array of values', (t) => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = ['John', 'B.', 'Fjon']

  const ret = objectToArr({ keys }, options)(data, state)

  t.deepEqual(ret, expected)
})

test('should skip values not included in keys', (t) => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'lastname']
  const expected = ['John', 'Fjon']

  const ret = objectToArr({ keys }, options)(data, state)

  t.deepEqual(ret, expected)
})

test('should return undefined for unknown keys', (t) => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'unknown', 'lastname']
  const expected = ['John', undefined, 'Fjon']

  const ret = objectToArr({ keys }, options)(data, state)

  t.deepEqual(ret, expected)
})

test('should return empty array when not an object', (t) => {
  const keys = ['firstname', 'middlename', 'lastname']

  t.deepEqual(objectToArr({ keys }, options)('Hello', state), [])
  t.deepEqual(objectToArr({ keys }, options)(3, state), [])
  t.deepEqual(objectToArr({ keys }, options)(new Date(), state), [])
  t.deepEqual(objectToArr({ keys }, options)(null, state), [])
  t.deepEqual(objectToArr({ keys }, options)(undefined, state), [])
})

// Tests -- reverse

test('should set the values of an array as props on an object in reverse', (t) => {
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }

  const ret = objectToArr({ keys }, options)(data, stateRev)

  t.deepEqual(ret, expected)
})

test('should skip values not included in keys in reverse', (t) => {
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'lastname']
  const expected = { firstname: 'John', lastname: 'B.' }

  const ret = objectToArr({ keys }, options)(data, stateRev)

  t.deepEqual(ret, expected)
})

test('should set undefined for missing values in reverse', (t) => {
  const data = ['John', 'B.']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: undefined }

  const ret = objectToArr({ keys }, options)(data, stateRev)

  t.deepEqual(ret, expected)
})

test('should return null when not an array in reverse', (t) => {
  const keys = ['firstname', 'middlename', 'lastname']

  t.is(objectToArr({ keys }, options)('Hello', stateRev), null)
  t.is(objectToArr({ keys }, options)(3, stateRev), null)
  t.is(objectToArr({ keys }, options)(new Date(), stateRev), null)
  t.is(objectToArr({ keys }, options)(null, stateRev), null)
  t.is(objectToArr({ keys }, options)(undefined, stateRev), null)
})
