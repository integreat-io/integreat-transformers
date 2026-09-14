import test from 'node:test'
import assert from 'node:assert/strict'

import monthName from './monthName.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return English month name for month number', () => {
  assert.equal(monthName({})(options)(1, state), 'January')
  assert.equal(monthName({})(options)(12, state), 'December')
})

test('should accept numeric strings', () => {
  assert.equal(monthName({})(options)('9', state), 'September')
  assert.equal(monthName({})(options)(' 9 ', state), 'September')
})

test('should return undefined for numbers out of range and non-numbers', () => {
  assert.equal(monthName({})(options)(0, state), undefined)
  assert.equal(monthName({})(options)(13, state), undefined)
  assert.equal(monthName({})(options)(1.5, state), undefined)
  assert.equal(monthName({})(options)('', state), undefined)
  assert.equal(monthName({})(options)('9x', state), undefined)
  assert.equal(monthName({})(options)('January', state), undefined)
  assert.equal(monthName({})(options)(null, state), undefined)
  assert.equal(monthName({})(options)({}, state), undefined)
})

test('should return month name in the given style', () => {
  assert.equal(monthName({ style: 'short' })(options)(9, state), 'Sep')
  assert.equal(monthName({ style: 'narrow' })(options)(1, state), 'J')
})

test('should return long month name for invalid style', () => {
  const props = { style: 'tiny' as 'long' }

  assert.equal(monthName(props)(options)(9, state), 'September')
})

test('should return month name in the given locale', () => {
  assert.equal(
    monthName({ locale: 'fr', style: 'short' })(options)(9, state),
    'sept.',
  )
  assert.equal(monthName({ locale: 'ru' })(options)(1, state), 'январь')
})

test('should fall back to English for invalid locale', () => {
  assert.equal(
    monthName({ locale: 'not a locale' })(options)(1, state),
    'January',
  )
})

test('should return month names for array of numbers', () => {
  const value = [1, '2', 3]
  const expected = ['January', 'February', 'March']
  const ret = monthName({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

// Tests -- reverse

test('should return month number for month name in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(monthName({})(options)('January', revState), 1)
  assert.equal(monthName({})(options)('May', revState), 5)
  assert.equal(monthName({})(options)('Sep', revState), 9)
  assert.equal(monthName({})(options)(' december ', revState), 12)
})

test('should match month name in the given locale in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(monthName({ locale: 'fr' })(options)('sept', revState), 9)
  assert.equal(monthName({ locale: 'fr' })(options)('fevrier', revState), 2)
})

test('should return undefined for narrow and unknown names in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(monthName({})(options)('J', revState), undefined)
  assert.equal(monthName({})(options)('Smarch', revState), undefined)
  assert.equal(monthName({})(options)('', revState), undefined)
})

test('should return undefined for non-strings in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(monthName({})(options)(3, revState), undefined)
  assert.equal(monthName({})(options)(null, revState), undefined)
})

test('should return month numbers for array of names in reverse', () => {
  const value = ['January', 'Feb']
  const expected = [1, 2]
  const ret = monthName({})(options)(value, { ...state, rev: true })

  assert.deepEqual(ret, expected)
})

test('should return month number going forward when flipped', () => {
  const value = 'March'
  const expected = 3
  const ret = monthName({})(options)(value, { ...state, flip: true })

  assert.equal(ret, expected)
})

test('should return month name in reverse when flipped', () => {
  const value = 3
  const expected = 'March'
  const ret = monthName({})(options)(value, { ...state, rev: true, flip: true })

  assert.equal(ret, expected)
})
