import test from 'ava'

import join from './join.js'

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
Note: The implementation is done in `split`, so these tests are just superficial
tests to make sure the functinionality is reversed.
*/

// Tests -- forward

test('should join a string by a separator char', async (t) => {
  const value = ['john', 'liz', 'benny']
  const sep = ','
  const expected = 'john,liz,benny'

  const ret = await join({ sep })(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should join segmented strings', async (t) => {
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

  const ret = await join({ size })(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should join going forward when flipped', async (t) => {
  const stateFlipped = { ...state, flip: true }
  const value = 'john,liz,benny'
  const sep = ','
  const expected = ['john', 'liz', 'benny']

  const ret = await join({ sep })(options)(value, stateFlipped)

  t.deepEqual(ret, expected)
})

// Tests -- reverse

test('should split a string by a separator char in reverse', async (t) => {
  const value = 'john,liz,benny'
  const sep = ','
  const expected = ['john', 'liz', 'benny']

  const ret = await join({ sep })(options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should split string into segments in reverse', async (t) => {
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

  const ret = await join({ size })(options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should join in reverse when flipped', async (t) => {
  const stateFlipped = { ...stateRev, flip: true }
  const value = ['john', 'liz', 'benny']
  const sep = ','
  const expected = 'john,liz,benny'

  const ret = await join({ sep })(options)(value, stateFlipped)

  t.deepEqual(ret, expected)
})
