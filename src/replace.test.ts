import test from 'ava'

import replace from './replace.js'

// Setup

const options = {}
const state = {
  onlyMappedValues: false,
  context: [],
  value: {},
  rev: false,
}
const stateRev = {
  onlyMappedValues: false,
  context: [],
  value: {},
  rev: true,
}

// Tests

test('should replace from service', (t) => {
  const props = { from: ':', to: '|' }
  const value = 'three:parts:here'
  const expected = 'three|parts|here'

  const ret = replace(props)(options)(value, state)

  t.is(ret, expected)
})

test('should replace to service', (t) => {
  const props = { from: ':', to: '|' }
  const value = 'three|parts|here'
  const expected = 'three:parts:here'

  const ret = replace(props)(options)(value, stateRev)

  t.is(ret, expected)
})

test('should replace from service in array', (t) => {
  const props = { from: ':', to: '|' }
  const value = ['three:parts:here']
  const expected = ['three|parts|here']

  const ret = replace(props)(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should replace to service in array', (t) => {
  const props = { from: ':', to: '|' }
  const value = ['three|parts|here']
  const expected = ['three:parts:here']

  const ret = replace(props)(options)(value, stateRev)

  t.deepEqual(ret, expected)
})

test('should do nothing when props are missing', (t) => {
  const props = {}
  const value = 'three:parts:here'
  const expected = value

  const ret = replace(props)(options)(value, state)

  t.is(ret, expected)
})

test('should replace to empty string from service', (t) => {
  const props = { from: ' ', to: '' }
  const value = 'three parts here'
  const expected = 'threepartshere'

  const ret = replace(props)(options)(value, state)

  t.is(ret, expected)
})

test('should not touch no-strings', (t) => {
  const props = { from: ':', to: '|' }

  t.is(replace(props)(options)(3, state), 3)
  t.deepEqual(replace(props)(options)({}, state), {})
  t.is(replace(props)(options)(null, state), null)
  t.is(replace(props)(options)(undefined, state), undefined)
})

test('should act as forward in reverse when flipped', (t) => {
  const stateFlipped = { ...stateRev, flip: true }
  const props = { from: ':', to: '|' }
  const value = 'three:parts:here'
  const expected = 'three|parts|here'

  const ret = replace(props)(options)(value, stateFlipped)

  t.is(ret, expected)
})

test('should act as reverse going forward when flipped', (t) => {
  const stateFlipped = { ...state, flip: true }
  const props = { from: ':', to: '|' }
  const value = 'three|parts|here'
  const expected = 'three:parts:here'

  const ret = replace(props)(options)(value, stateFlipped)

  t.is(ret, expected)
})
