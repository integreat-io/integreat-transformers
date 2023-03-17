import test from 'ava'

import count from './count.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false, // Will apply in both directions
  context: [],
  value: {},
}

// Tests

test('should count the number of items in an array', (t) => {
  const data = [1, 3, {}, new Date(), true, 'hello']
  const expected = 6

  const ret = count({})(options)(data, state)

  t.is(ret, expected)
})

test('should not count null and undefined in an array', (t) => {
  const data = [1, 3, undefined, {}, new Date(), null, true, 'hello']
  const expected = 6

  const ret = count({})(options)(data, state)

  t.is(ret, expected)
})

test('should skip provided values when counting', (t) => {
  const data = [1, 3, undefined, {}, new Date(), null, true, 'hello']
  const skip = [3, 'hello', '**undefined**']
  const expected = 5

  const ret = count({ skip })(options)(data, state)

  t.is(ret, expected)
})

test('should count a non-array element as 1', (t) => {
  t.is(count({})(options)({}, state), 1)
  t.is(count({})(options)(new Date(), state), 1)
  t.is(count({})(options)(3, state), 1)
  t.is(count({})(options)('hello', state), 1)
  t.is(count({})(options)(true, state), 1)
})

test('should count undefined and null as 0', (t) => {
  t.is(count({})(options)(undefined, state), 0)
  t.is(count({})(options)(null, state), 0)
})

test('should not count skipped values', (t) => {
  const skip = [3, 'hello', '**undefined**']
  t.is(count({ skip })(options)({}, state), 1)
  t.is(count({ skip })(options)(new Date(), state), 1)
  t.is(count({ skip })(options)(3, state), 0)
  t.is(count({ skip })(options)('hello', state), 0)
  t.is(count({ skip })(options)(true, state), 1)
  t.is(count({ skip })(options)(undefined, state), 0)
  t.is(count({ skip })(options)(null, state), 1)
})
