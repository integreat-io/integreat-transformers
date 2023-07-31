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

test('should extract the values on an object to an array of values', async (t) => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = ['John', 'B.', 'Fjon']

  const ret = await objectToArr({ keys })(options)(data, state)

  t.deepEqual(ret, expected)
})

test('should skip values not included in keys', async (t) => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'lastname']
  const expected = ['John', 'Fjon']

  const ret = await objectToArr({ keys })(options)(data, state)

  t.deepEqual(ret, expected)
})

test('should return undefined for unknown keys', async (t) => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'unknown', 'lastname']
  const expected = ['John', undefined, 'Fjon']

  const ret = await objectToArr({ keys })(options)(data, state)

  t.deepEqual(ret, expected)
})

test('should return empty array when not an object', async (t) => {
  const keys = ['firstname', 'middlename', 'lastname']

  t.deepEqual(await objectToArr({ keys })(options)('Hello', state), [])
  t.deepEqual(await objectToArr({ keys })(options)(3, state), [])
  t.deepEqual(await objectToArr({ keys })(options)(new Date(), state), [])
  t.deepEqual(await objectToArr({ keys })(options)(null, state), [])
  t.deepEqual(await objectToArr({ keys })(options)(undefined, state), [])
})

// Tests -- reverse

test('should set the values of an array as props on an object in reverse', async (t) => {
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }

  const ret = await objectToArr({ keys })(options)(data, stateRev)

  t.deepEqual(ret, expected)
})

test('should skip values not included in keys in reverse', async (t) => {
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'lastname']
  const expected = { firstname: 'John', lastname: 'B.' }

  const ret = await objectToArr({ keys })(options)(data, stateRev)

  t.deepEqual(ret, expected)
})

test('should set undefined for missing values in reverse', async (t) => {
  const data = ['John', 'B.']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: undefined }

  const ret = await objectToArr({ keys })(options)(data, stateRev)

  t.deepEqual(ret, expected)
})

test('should return null when not an array in reverse', async (t) => {
  const keys = ['firstname', 'middlename', 'lastname']

  t.is(await objectToArr({ keys })(options)('Hello', stateRev), null)
  t.is(await objectToArr({ keys })(options)(3, stateRev), null)
  t.is(await objectToArr({ keys })(options)(new Date(), stateRev), null)
  t.is(await objectToArr({ keys })(options)(null, stateRev), null)
  t.is(await objectToArr({ keys })(options)(undefined, stateRev), null)
})
