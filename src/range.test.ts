import test from 'ava'

import range from './range.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false, // Will apply in both directions
  context: [],
  value: {},
}

// Tests

test('should split number range into integers', (t) => {
  const start = 5
  const end = 13
  const expected = [5, 6, 7, 8, 9, 10, 11, 12]

  const ret = range({ start, end }, options)(undefined, state)

  t.deepEqual(ret, expected)
})

test('should split number range into integers including end', (t) => {
  const start = 5
  const end = 13
  const includeEnd = true
  const expected = [5, 6, 7, 8, 9, 10, 11, 12, 13]

  const ret = range({ start, end, includeEnd }, options)(undefined, state)

  t.deepEqual(ret, expected)
})

test('should split number range with step', (t) => {
  const start = 5
  const end = 13
  const step = 2
  const expected = [5, 7, 9, 11]

  const ret = range({ start, end, step }, options)(undefined, state)

  t.deepEqual(ret, expected)
})

test('should split number range with step and including end', (t) => {
  const start = 5
  const end = 13
  const step = 2
  const includeEnd = true
  const expected = [5, 7, 9, 11, 13]

  const ret = range({ start, end, step, includeEnd }, options)(undefined, state)

  t.deepEqual(ret, expected)
})

test('should split number range from paths', (t) => {
  const value = { first: 5, last: 13, width: 4 }
  const startPath = 'first'
  const endPath = 'last'
  const stepPath = 'width'
  const includeEnd = true
  const expected = [5, 9, 13]

  const ret = range({ startPath, endPath, stepPath, includeEnd }, options)(
    value,
    state
  )

  t.deepEqual(ret, expected)
})

test('should return undefined when no start or end', (t) => {
  const start = undefined
  const end = undefined
  const expected = undefined

  const ret = range({ start, end }, options)(undefined, state)

  t.is(ret, expected)
})
