import test from 'node:test'
import assert from 'node:assert/strict'

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

test('should replace from service', () => {
  const props = { from: ':', to: '|' }
  const value = 'three:parts:here'
  const expected = 'three|parts|here'

  const ret = replace(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should replace to service', () => {
  const props = { from: ':', to: '|' }
  const value = 'three|parts|here'
  const expected = 'three:parts:here'

  const ret = replace(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should replace from service in array', () => {
  const props = { from: ':', to: '|' }
  const value = ['three:parts:here']
  const expected = ['three|parts|here']

  const ret = replace(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should replace to service in array', () => {
  const props = { from: ':', to: '|' }
  const value = ['three|parts|here']
  const expected = ['three:parts:here']

  const ret = replace(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should do nothing when props are missing', () => {
  const props = {}
  const value = 'three:parts:here'
  const expected = value

  const ret = replace(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should replace to empty string from service', () => {
  const props = { from: ' ', to: '' }
  const value = 'three parts here'
  const expected = 'threepartshere'

  const ret = replace(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should not touch no-strings', () => {
  const props = { from: ':', to: '|' }

  assert.deepEqual(replace(props)(options)(3, state), 3)
  assert.deepEqual(replace(props)(options)({}, state), {})
  assert.deepEqual(replace(props)(options)(null, state), null)
  assert.deepEqual(replace(props)(options)(undefined, state), undefined)
})

test('should act as forward in reverse when flipped', () => {
  const stateFlipped = { ...stateRev, flip: true }
  const props = { from: ':', to: '|' }
  const value = 'three:parts:here'
  const expected = 'three|parts|here'

  const ret = replace(props)(options)(value, stateFlipped)

  assert.deepEqual(ret, expected)
})

test('should act as reverse going forward when flipped', () => {
  const stateFlipped = { ...state, flip: true }
  const props = { from: ':', to: '|' }
  const value = 'three|parts|here'
  const expected = 'three:parts:here'

  const ret = replace(props)(options)(value, stateFlipped)

  assert.deepEqual(ret, expected)
})
