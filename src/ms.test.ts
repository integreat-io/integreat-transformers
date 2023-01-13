import test from 'ava'

import ms from './ms.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should convert Date to milliseconds', (t) => {
  const value = new Date('2022-01-13T14:58:46.975Z')
  const expected = 1642085926975

  const ret = ms({}, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should convert date string to milliseconds', (t) => {
  const value = '2022-01-13T14:58:46.975Z'
  const expected = 1642085926975

  const ret = ms({}, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return milliseconds as milliseconds', (t) => {
  const value = 1642085926975
  const expected = 1642085926975

  const ret = ms({}, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return undefined when not ms or Date', (t) => {
  t.is(ms({}, options)('Hello', state), undefined)
  t.is(ms({}, options)({}, state), undefined)
  t.is(ms({}, options)(true, state), undefined)
  t.is(ms({}, options)(null, state), undefined)
  t.is(ms({}, options)(undefined, state), undefined)
})
