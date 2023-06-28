import test from 'ava'
import dedupe from './dedupe.js'

// Setup

const options = {}
const state = {
  context: [],
  value: {},
}

// Tests

test('should remove duplicates in a flat array of strings', (t) => {
  const value = ['1', '1', '1', '2', '3']
  const expected = ['1', '2', '3']

  const ret = dedupe({})(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should remove duplicates in arrays with different simple data types', (t) => {
  const value = ['1', '1', '1', '2', '3', 1, 2, 2, 2, 3]
  const expected = ['1', '2', '3', 1, 2, 3]

  const ret = dedupe({})(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should remove duplicates in arrays with booleans', (t) => {
  const value = ['1', '1', '1', '2', '3', true, true, null, null, false, false]
  const expected = ['1', '2', '3', true, null, false]

  const ret = dedupe({})(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should remove objects with the same values and structures', (t) => {
  const value = [{ value: '1' }, { value: '1' }, { value: '2' }]
  const expected = [{ value: '1' }, { value: '2' }]

  const ret = dedupe({ path: 'value' })(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return empty array if array is empty', (t) => {
  const value: [] = []
  const expected: [] = []

  const ret = dedupe({})(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return data if data is not an array', (t) => {
  const value = { test: 'whatever' }
  const expected = { test: 'whatever' }

  const ret = dedupe({})(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should remove objects with nested values', (t) => {
  const value = [
    { container: { value: '1' } },
    { container: { value: '1' } },
    { container: { value: '2' } },
    { container: { value: '2' } },
    { container: { value: '3' } },
  ]
  const expected = [
    { container: { value: '1' } },
    { container: { value: '2' } },
    { container: { value: '3' } },
  ]

  const ret = dedupe({ path: 'container.value' })(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should remove duplicates of simple data when no path specficied', (t) => {
  const value = [
    1,
    1,
    2,
    2,
    3,
    { container: { value: '1' } },
    { container: { value: '1' } },
    { container: { value: '2' } },
    { container: { value: '2' } },
    { container: { value: '3' } },
  ]
  const expected = [
    1,
    2,
    3,
    { container: { value: '1' } },
    { container: { value: '1' } },
    { container: { value: '2' } },
    { container: { value: '2' } },
    { container: { value: '3' } },
  ]

  const ret = dedupe({})(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should remove duplicates all instances of undefined', (t) => {
  const value = [
    1,
    1,
    undefined,
    3,
    { container: { value: '1' } },
    { container: { value: '1' } },
    { container: { value: '2' } },
  ]
  const expected = [
    1,
    3,
    { container: { value: '1' } },
    { container: { value: '1' } },
    { container: { value: '2' } },
  ]

  const ret = dedupe({})(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should remove all items where value of path becomes undefined', (t) => {
  const value = [
    1,
    1,
    undefined,
    3,
    { container: {} },
    { container: { value: undefined } },
    { container: { value: '1' } },
    { container: { value: '2' } },
  ]
  const expected = [
    { container: { value: '1' } },
    { container: { value: '2' } },
  ]

  const ret = dedupe({ path: 'container.value' })(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should remove all but the first unique object based on path value', (t) => {
  const value = [
    { container: { value: '1', id: '1' } },
    { container: { value: '1', id: '1' } },
    { container: { value: '1', id: '2' } },
    { container: { value: '2' } },
  ]
  const expected = [
    { container: { value: '1', id: '1' } },
    { container: { value: '2' } },
  ]

  const ret = dedupe({ path: 'container.value' })(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should keep falsy values, other than undefined', (t) => {
  const value = [
    undefined,
    null,
    0,
    NaN,
    1,
    '',
    'string',
    { container: { value: '1', id: '1' } },
  ]
  const expected = [
    null,
    0,
    1,
    '',
    'string',
    { container: { value: '1', id: '1' } },
  ]

  const ret = dedupe({})(options)(value, state)

  t.deepEqual(ret, expected)
})