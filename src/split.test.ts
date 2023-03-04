import test from 'ava'

import split from './split.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

const stateRev = { ...state, rev: true }

// Tests -- split with size -- forward

test('should split string into segments', (t) => {
  const value = 'A longer string to split up in smaller parts by a given size'
  const size = 10
  const expected = [
    'A longer s',
    'tring to s',
    'plit up in',
    ' smaller p',
    'arts by a ',
    'given size',
  ]

  const ret = split({ size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split short string into one segment', (t) => {
  const value = 'A short'
  const size = 10
  const expected = ['A short']

  const ret = split({ size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split empty string into empty array', (t) => {
  const value = ''
  const size = 10
  const expected: unknown[] = []

  const ret = split({ size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split number as a string', (t) => {
  const value = 1458332
  const size = 3
  const expected = ['145', '833', '2']

  const ret = split({ size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split array into sub-arrays', (t) => {
  const value = ['An', 'array', 'of', 'words', 'to', 'group', 'in', 'segments']
  const size = 3
  const expected = [
    ['An', 'array', 'of'],
    ['words', 'to', 'group'],
    ['in', 'segments'],
  ]

  const ret = split({ size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split short array into sub-arrays', (t) => {
  const value = ['An', 'array']
  const size = 3
  const expected = [['An', 'array']]

  const ret = split({ size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return empty array as empty array', (t) => {
  const value: unknown[] = []
  const size = 3
  const expected: unknown[] = []

  const ret = split({ size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return other values untouched', (t) => {
  const size = 10
  const date = new Date()
  const object = {}

  t.is(split({ size }, options)(true, state), true)
  t.is(split({ size }, options)(object, state), object)
  t.is(split({ size }, options)(date, state), date)
  t.is(split({ size }, options)(null, state), null)
  t.is(split({ size }, options)(undefined, state), undefined)
})

test('should split string into segments from a path', (t) => {
  const value = {
    content: {
      title: 'A longer string to split up in smaller parts by a given size',
    },
  }
  const size = 10
  const path = 'content.title'
  const expected = [
    'A longer s',
    'tring to s',
    'plit up in',
    ' smaller p',
    'arts by a ',
    'given size',
  ]

  const ret = split({ path, size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split with size from a path', (t) => {
  const value = {
    content: {
      title: 'A longer string to split up in smaller parts by a given size',
    },
    size: 10,
  }
  const sizePath = 'size'
  const path = 'content.title'
  const expected = [
    'A longer s',
    'tring to s',
    'plit up in',
    ' smaller p',
    'arts by a ',
    'given size',
  ]

  const ret = split({ path, sizePath }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should use size prop as a fallback value for sizePath', (t) => {
  const value = {
    content: {
      title: 'A longer string to split up in smaller parts by a given size',
    },
    size: 'not a number',
  }
  const sizePath = 'size'
  const size = 10
  const path = 'content.title'
  const expected = [
    'A longer s',
    'tring to s',
    'plit up in',
    ' smaller p',
    'arts by a ',
    'given size',
  ]

  const ret = split({ path, sizePath, size }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return value untouched when size is not a number', (t) => {
  const value = 'A longer string to split up in smaller parts by a given size'
  const size = 'not a number'
  const expected = value

  const ret = split({ size }, options)(value, state)

  t.is(ret, expected)
})

test('should return value from a path untouched when size is not a number', (t) => {
  const value = {
    content: {
      title: 'A longer string to split up in smaller parts by a given size',
    },
  }
  const size = undefined
  const path = 'content.title'
  const expected =
    'A longer string to split up in smaller parts by a given size'

  const ret = split({ path, size }, options)(value, state)

  t.is(ret, expected)
})

// Tests -- join with size -- reverse

test('should join segmented strings in reverse', (t) => {
  const value = [
    'A longer s',
    'tring to s',
    'plit up in',
    ' smaller p',
    'arts by a ',
    'given size',
  ]
  const size = 10
  const expected =
    'A longer string to split up in smaller parts by a given size'

  const ret = split({ size }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should join array of arrays into flattened array in reverse', (t) => {
  const value = [
    ['An', 'array', 'of'],
    ['words', 'to', 'group'],
    ['in', 'segments'],
  ]
  const size = 3
  const expected = [
    'An',
    'array',
    'of',
    'words',
    'to',
    'group',
    'in',
    'segments',
  ]

  const ret = split({ size }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should return empty array as empty array in reverse', (t) => {
  const value: unknown[] = []
  const size = 3
  const expected: unknown[] = []

  const ret = split({ size }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should return non-arrays untouched in reverse', (t) => {
  const size = 10
  const date = new Date()
  const object = {}

  t.is(split({ size }, options)('string', stateRev), 'string')
  t.is(split({ size }, options)(true, stateRev), true)
  t.is(split({ size }, options)(object, stateRev), object)
  t.is(split({ size }, options)(date, stateRev), date)
  t.is(split({ size }, options)(null, stateRev), null)
  t.is(split({ size }, options)(undefined, stateRev), undefined)
})

test('should join segmented strings from a path in reverse', (t) => {
  const value = {
    segments: [
      'A longer s',
      'tring to s',
      'plit up in',
      ' smaller p',
      'arts by a ',
      'given size',
    ],
  }
  const path = 'segments'
  const size = 10
  const expected =
    'A longer string to split up in smaller parts by a given size'

  const ret = split({ path, size }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})
