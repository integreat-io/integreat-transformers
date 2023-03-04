import test from 'ava'

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

test('should set the values of an array as props on an object', (t) => {
  const data = ['John', 'B.', 'Fjon']
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }

  const ret = arrToObject({ keys }, options)(data, state)

  t.deepEqual(ret, expected)
})

// Tests -- reverse

test('should extract the values on an object to an array of values in reverse', (t) => {
  const data = { firstname: 'John', middlename: 'B.', lastname: 'Fjon' }
  const keys = ['firstname', 'middlename', 'lastname']
  const expected = ['John', 'B.', 'Fjon']

  const ret = arrToObject({ keys }, options)(data, stateRev)

  t.deepEqual(ret, expected)
})
