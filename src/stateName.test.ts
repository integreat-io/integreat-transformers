import test from 'node:test'
import assert from 'node:assert/strict'
import normalizeName from './utils/normalizeName.js'
import states from './utils/states.js'

import stateName from './stateName.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return English state name for state code', () => {
  assert.equal(stateName({})(options)('US-NY', state), 'New York')
  assert.equal(stateName({})(options)('CA-QC', state), 'Quebec')
  assert.equal(stateName({})(options)('US-DC', state), 'District of Columbia')
  assert.equal(stateName({})(options)('US-PR', state), 'Puerto Rico')
})

test('should accept lowercase state code and trim it', () => {
  const value = ' us-ny '
  const expected = 'New York'
  const ret = stateName({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return undefined for unknown or incomplete state code', () => {
  assert.equal(stateName({})(options)('NY', state), undefined)
  assert.equal(stateName({})(options)('US-XX', state), undefined)
  assert.equal(stateName({})(options)('NO-03', state), undefined)
  assert.equal(stateName({})(options)('', state), undefined)
})

test('should return undefined for names of object prototype properties', () => {
  assert.equal(stateName({})(options)('__proto__', state), undefined)
  assert.equal(stateName({})(options)('constructor', state), undefined)
})

test('should return undefined for non-strings', () => {
  assert.equal(stateName({})(options)(3, state), undefined)
  assert.equal(stateName({})(options)(null, state), undefined)
  assert.equal(stateName({})(options)(undefined, state), undefined)
  assert.equal(stateName({})(options)({}, state), undefined)
})

test('should return state names for array of codes', () => {
  const value = ['US-NY', 'CA-ON']
  const expected = ['New York', 'Ontario']
  const ret = stateName({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

// Tests -- reverse

test('should return state code for state name in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(stateName({})(options)('New York', revState), 'US-NY')
  assert.equal(stateName({})(options)('British Columbia', revState), 'CA-BC')
})

test('should match state name regardless of case, accents and punctuation in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(stateName({})(options)('  new YORK ', revState), 'US-NY')
  assert.equal(stateName({})(options)('québec', revState), 'CA-QC')
  assert.equal(
    stateName({})(options)('newfoundland & labrador', revState),
    'CA-NL',
  )
  assert.equal(stateName({})(options)('US Virgin Islands', revState), 'US-VI')
})

test('should return undefined for unknown state name in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(stateName({})(options)('Atlantis', revState), undefined)
  assert.equal(stateName({})(options)('', revState), undefined)
  assert.equal(stateName({})(options)('US-NY', revState), undefined)
})

test('should return undefined for non-strings in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(stateName({})(options)(3, revState), undefined)
  assert.equal(stateName({})(options)(null, revState), undefined)
  assert.equal(stateName({})(options)({}, revState), undefined)
})

test('should return state codes for array of names in reverse', () => {
  const value = ['New York', 'Ontario']
  const expected = ['US-NY', 'CA-ON']
  const ret = stateName({})(options)(value, { ...state, rev: true })

  assert.deepEqual(ret, expected)
})

test('should return state code going forward when flipped', () => {
  const value = 'New York'
  const expected = 'US-NY'
  const ret = stateName({})(options)(value, { ...state, flip: true })

  assert.equal(ret, expected)
})

test('should return state name in reverse when flipped', () => {
  const value = 'US-NY'
  const expected = 'New York'
  const ret = stateName({})(options)(value, {
    ...state,
    rev: true,
    flip: true,
  })

  assert.equal(ret, expected)
})

// Tests -- data

test('should have valid ISO 3166-2 codes as keys', () => {
  const invalid = Object.keys(states).filter(
    (code) => !/^[A-Z]{2}-[A-Z0-9]{1,3}$/.test(code),
  )

  assert.deepEqual(invalid, [])
})

test('should have all US and Canadian states', () => {
  const codes = Object.keys(states)

  assert.equal(codes.filter((code) => code.startsWith('US-')).length, 57)
  assert.equal(codes.filter((code) => code.startsWith('CA-')).length, 13)
})

test('should not have names that are equal when normalized', () => {
  const names = Object.values(states).map(normalizeName)

  assert.equal(new Set(names).size, names.length)
})
