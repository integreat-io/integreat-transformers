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

test('should split with size from a path given as a string', (t) => {
  const value = {
    content: {
      title: 'A longer string to split up in smaller parts by a given size',
    },
    size: '10',
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

// Tests -- split with separator -- forward

test('should split a string by a separator char', (t) => {
  const value = 'john,liz,benny'
  const sep = ','
  const expected = ['john', 'liz', 'benny']

  const ret = split({ sep }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split a string by default separator char', (t) => {
  const value = 'The string to split'
  const sep = undefined
  const expected = ['The', 'string', 'to', 'split']

  const ret = split({ sep }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split a string by a separator char found at sepPath', (t) => {
  const value = { users: 'john,liz,benny', separator: ',' }
  const path = 'users'
  const sepPath = 'separator'
  const expected = ['john', 'liz', 'benny']

  const ret = split({ path, sepPath }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should allow numbers as separator', (t) => {
  const value = { users: '183100342', separator: 3 }
  const path = 'users'
  const sepPath = 'separator'
  const expected = ['18', '100', '42']

  const ret = split({ path, sepPath }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should split a string by sep when sepPath does not get a string', (t) => {
  const value = { users: 'john,liz,benny', separator: true }
  const path = 'users'
  const sep = ','
  const sepPath = 'separator'
  const expected = ['john', 'liz', 'benny']

  const ret = split({ path, sep, sepPath }, options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return other values untouched when splitting by sep', (t) => {
  const sep = ' '
  const date = new Date()
  const object = {}
  const arr = ['A', 'split', 'string']

  t.is(split({ sep }, options)(true, state), true)
  t.is(split({ sep }, options)(arr, state), arr)
  t.is(split({ sep }, options)(object, state), object)
  t.is(split({ sep }, options)(date, state), date)
  t.is(split({ sep }, options)(null, state), null)
  t.is(split({ sep }, options)(undefined, state), undefined)
})

// Tests -- join with separator -- reverse

test('should join a string by a separator char in reverse', (t) => {
  const value = ['john', 'liz', 'benny']
  const sep = ','
  const expected = 'john,liz,benny'

  const ret = split({ sep }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should join a string with space as default separator char in reverse', (t) => {
  const value = ['The', 'string', 'to', 'split']
  const sep = undefined
  const expected = 'The string to split'

  const ret = split({ sep }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should join a string by an empty separator char in reverse', (t) => {
  const value = ['john', 'liz', 'benny']
  const sep = ''
  const expected = 'johnlizbenny'

  const ret = split({ sep }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should join a string by a separator char found at sepPath in reverse', (t) => {
  const value = { users: ['john', 'liz', 'benny'], separator: ',' }
  const path = 'users'
  const sepPath = 'separator'
  const expected = 'john,liz,benny'

  const ret = split({ path, sepPath }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should allow numbers as separator in reverse', (t) => {
  const value = { users: ['18', '100', '42'], separator: 3 }
  const path = 'users'
  const sepPath = 'separator'
  const expected = '183100342'

  const ret = split({ path, sepPath }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should join a string by sep when sepPath does not get a string in reverse', (t) => {
  const value = { users: ['john', 'liz', 'benny'], separator: true }
  const path = 'users'
  const sep = ','
  const sepPath = 'separator'
  const expected = 'john,liz,benny'

  const ret = split({ path, sep, sepPath }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

// TODO: Consider if we should still return a string here
test('should not touch arrays without strings', (t) => {
  const value = [true, null, {}]
  const sep = ','
  const expected = [true, null, {}]

  const ret = split({ sep }, options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should return other values untouched when joining by sep in reverse', (t) => {
  const sep = ' '
  const date = new Date()
  const object = {}

  t.is(split({ sep }, options)(true, stateRev), true)
  t.is(split({ sep }, options)(object, stateRev), object)
  t.is(split({ sep }, options)(date, stateRev), date)
  t.is(split({ sep }, options)(null, stateRev), null)
  t.is(split({ sep }, options)(undefined, stateRev), undefined)
})
