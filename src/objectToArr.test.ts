import test from 'node:test'
import assert from 'node:assert/strict'

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

test('should extract the values on an object to an array of values', async () => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = ['John', 'B.', 'Fjon']

  const ret = await objectToArr({ keys })(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should skip values not included in keys', async () => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'lastname']
  const expected = ['John', 'Fjon']

  const ret = await objectToArr({ keys })(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined for unknown keys', async () => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'unknown', 'lastname']
  const expected = ['John', undefined, 'Fjon']

  const ret = await objectToArr({ keys })(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should return empty array when not an object', async () => {
  const keys = ['firstname', 'middlename', 'lastname']

  assert.deepEqual(await objectToArr({ keys })(options)('Hello', state), [])
  assert.deepEqual(await objectToArr({ keys })(options)(3, state), [])
  assert.deepEqual(await objectToArr({ keys })(options)(new Date(), state), [])
  assert.deepEqual(await objectToArr({ keys })(options)(null, state), [])
  assert.deepEqual(await objectToArr({ keys })(options)(undefined, state), [])
})

test('should operate as in reverse when going forward and flipped', async () => {
  const stateFlipped = { ...state, flip: true }
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }

  const ret = await objectToArr({ keys })(options)(data, stateFlipped)

  assert.deepEqual(ret, expected)
})

// Tests -- reverse

test('should set the values of an array as props on an object in reverse', async () => {
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }

  const ret = await objectToArr({ keys })(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should skip values not included in keys in reverse', async () => {
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'lastname']
  const expected = { firstname: 'John', lastname: 'B.' }

  const ret = await objectToArr({ keys })(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should set undefined for missing values in reverse', async () => {
  const data = ['John', 'B.']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: undefined }

  const ret = await objectToArr({ keys })(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should return null when not an array in reverse', async () => {
  const keys = ['firstname', 'middlename', 'lastname']

  assert.deepEqual(
    await objectToArr({ keys })(options)('Hello', stateRev),
    null,
  )
  assert.deepEqual(await objectToArr({ keys })(options)(3, stateRev), null)
  assert.deepEqual(
    await objectToArr({ keys })(options)(new Date(), stateRev),
    null,
  )
  assert.deepEqual(await objectToArr({ keys })(options)(null, stateRev), null)
  assert.deepEqual(
    await objectToArr({ keys })(options)(undefined, stateRev),
    null,
  )
})

test('should operate as forward when in reverse and flipped', async () => {
  const stateFlipped = { ...stateRev, flip: true }
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = ['John', 'B.', 'Fjon']

  const ret = await objectToArr({ keys })(options)(data, stateFlipped)

  assert.deepEqual(ret, expected)
})
