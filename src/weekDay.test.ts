import test from 'node:test'
import assert from 'node:assert/strict'

import weekDay from './weekDay.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return English weekday name for weekday number', () => {
  assert.equal(weekDay({})(options)(0, state), 'Sunday')
  assert.equal(weekDay({})(options)(1, state), 'Monday')
  assert.equal(weekDay({})(options)(6, state), 'Saturday')
  assert.equal(weekDay({})(options)(7, state), 'Sunday')
})

test('should accept numeric strings', () => {
  assert.equal(weekDay({})(options)('3', state), 'Wednesday')
  assert.equal(weekDay({})(options)(' 3 ', state), 'Wednesday')
})

test('should return undefined for numbers out of range and non-numbers', () => {
  assert.equal(weekDay({})(options)(-1, state), undefined)
  assert.equal(weekDay({})(options)(8, state), undefined)
  assert.equal(weekDay({})(options)(1.5, state), undefined)
  assert.equal(weekDay({})(options)(NaN, state), undefined)
  assert.equal(weekDay({})(options)('', state), undefined)
  assert.equal(weekDay({})(options)('3x', state), undefined)
  assert.equal(weekDay({})(options)('Monday', state), undefined)
  assert.equal(weekDay({})(options)(null, state), undefined)
  assert.equal(weekDay({})(options)(undefined, state), undefined)
  assert.equal(weekDay({})(options)({}, state), undefined)
})

test('should return weekday name in the given style', () => {
  assert.equal(weekDay({ style: 'short' })(options)(0, state), 'Sun')
  assert.equal(weekDay({ style: 'narrow' })(options)(0, state), 'S')
  assert.equal(weekDay({ style: 'long' })(options)(0, state), 'Sunday')
})

test('should return long weekday name for invalid style', () => {
  const props = { style: 'tiny' as 'long' }

  assert.equal(weekDay(props)(options)(0, state), 'Sunday')
})

test('should return weekday name in the given locale', () => {
  assert.equal(weekDay({ locale: 'nb' })(options)(0, state), 'søndag')
  assert.equal(
    weekDay({ locale: 'nb', style: 'short' })(options)(0, state),
    'søn.',
  )
})

test('should fall back to English for invalid locale', () => {
  assert.equal(weekDay({ locale: 'not a locale' })(options)(1, state), 'Monday')
})

test('should return weekday names for array of numbers', () => {
  const value = [1, 2, '5']
  const expected = ['Monday', 'Tuesday', 'Friday']
  const ret = weekDay({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

// Tests -- reverse

test('should return weekday number for weekday name in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(weekDay({})(options)('Sunday', revState), 0)
  assert.equal(weekDay({})(options)('Mon', revState), 1)
  assert.equal(weekDay({})(options)(' tuesday ', revState), 2)
  assert.equal(weekDay({})(options)('Saturday', revState), 6)
})

test('should match long names in reverse when style is short', () => {
  const revState = { ...state, rev: true }

  assert.equal(weekDay({ style: 'short' })(options)('Monday', revState), 1)
})

test('should match weekday name in the given locale in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(weekDay({ locale: 'nb' })(options)('lørdag', revState), 6)
  assert.equal(weekDay({ locale: 'nb' })(options)('søn', revState), 0)
})

test('should return undefined for narrow and unknown names in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(weekDay({})(options)('S', revState), undefined)
  assert.equal(weekDay({ style: 'narrow' })(options)('M', revState), undefined)
  assert.equal(weekDay({})(options)('Funday', revState), undefined)
  assert.equal(weekDay({})(options)('', revState), undefined)
})

test('should return undefined for non-strings in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(weekDay({})(options)(3, revState), undefined)
  assert.equal(weekDay({})(options)(null, revState), undefined)
  assert.equal(weekDay({})(options)({}, revState), undefined)
})

test('should return weekday numbers for array of names in reverse', () => {
  const value = ['Monday', 'Sun']
  const expected = [1, 0]
  const ret = weekDay({})(options)(value, { ...state, rev: true })

  assert.deepEqual(ret, expected)
})

test('should return weekday number going forward when flipped', () => {
  const value = 'Monday'
  const expected = 1
  const ret = weekDay({})(options)(value, { ...state, flip: true })

  assert.equal(ret, expected)
})

test('should return weekday name in reverse when flipped', () => {
  const value = 1
  const expected = 'Monday'
  const ret = weekDay({})(options)(value, { ...state, rev: true, flip: true })

  assert.equal(ret, expected)
})
