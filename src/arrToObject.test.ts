import test from 'node:test'
import assert from 'node:assert/strict'

import arrToObject from './arrToObject.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

const stateRev = { ...state, rev: true }

/*
Note: The implementation is done in `objectToArr`, so these tests are just
superficial tests to make sure the functionality is reversed.
*/

// Tests -- forward

test('should set the values of an array as props on an object', async () => {
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }

  const ret = await arrToObject({ keys })(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should operate as in reverse when going forward and flipped', async () => {
  const stateFlipped = { ...state, flip: true }
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = ['John', 'B.', 'Fjon']

  const ret = await arrToObject({ keys })(options)(data, stateFlipped)

  assert.deepEqual(ret, expected)
})

// Tests -- reverse

test('should extract the values on an object to an array of values in reverse', async () => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = ['John', 'B.', 'Fjon']

  const ret = await arrToObject({ keys })(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should operate as forward when in reverse and flipped', async () => {
  const stateFlipped = { ...stateRev, flip: true }
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }

  const ret = await arrToObject({ keys })(options)(data, stateFlipped)

  assert.deepEqual(ret, expected)
})
