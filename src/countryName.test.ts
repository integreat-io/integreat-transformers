import test from 'node:test'
import assert from 'node:assert/strict'

import countryName from './countryName.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return English country name for country code', () => {
  assert.equal(countryName({})(options)('NO', state), 'Norway')
  assert.equal(countryName({})(options)('US', state), 'United States')
  assert.equal(countryName({})(options)('FI', state), 'Finland')
})

test('should accept lowercase country code', () => {
  const value = 'no'
  const expected = 'Norway'
  const ret = countryName({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should trim country code', () => {
  const value = ' NO '
  const expected = 'Norway'
  const ret = countryName({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return country name in given locale', () => {
  const props = { locale: 'nb' }

  assert.equal(countryName(props)(options)('SE', state), 'Sverige')
  assert.equal(countryName(props)(options)('US', state), 'USA')
})

test('should fall back to English for invalid locale', () => {
  const props = { locale: 'not a locale!' }
  const value = 'NO'
  const expected = 'Norway'
  const ret = countryName(props)(options)(value, state)

  assert.equal(ret, expected)
})

test('should return undefined for unknown country code', () => {
  const value = 'XX'
  const expected = undefined
  const ret = countryName({})(options)(value, state)

  assert.equal(ret, expected)
})

test('should return undefined for malformed country code', () => {
  assert.equal(countryName({})(options)('Norway', state), undefined)
  assert.equal(countryName({})(options)('', state), undefined)
})

test('should return undefined for non-strings', () => {
  assert.equal(countryName({})(options)(3, state), undefined)
  assert.equal(countryName({})(options)(null, state), undefined)
  assert.equal(countryName({})(options)(undefined, state), undefined)
  assert.equal(countryName({})(options)({}, state), undefined)
})

test('should return country names for array of codes', () => {
  const value = ['NO', 'FI']
  const expected = ['Norway', 'Finland']
  const ret = countryName({})(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return name for reserved codes that are not countries', () => {
  assert.equal(countryName({})(options)('EU', state), 'European Union')
  assert.equal(countryName({})(options)('EZ', state), 'Eurozone')
  assert.equal(countryName({})(options)('UN', state), 'United Nations')
  assert.equal(countryName({})(options)('QO', state), 'Outlying Oceania')
})

test('should return undefined for unknown region and pseudo codes', () => {
  assert.equal(countryName({})(options)('ZZ', state), undefined)
  assert.equal(countryName({})(options)('XA', state), undefined)
  assert.equal(countryName({})(options)('XB', state), undefined)
})

test('should return name of current country for deprecated code', () => {
  const value = 'UK'
  const expected = 'United Kingdom'
  const ret = countryName({})(options)(value, state)

  assert.equal(ret, expected)
})

// Tests -- reverse

test('should return country code for country name in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(countryName({})(options)('Norway', revState), 'NO')
  assert.equal(countryName({})(options)('United States', revState), 'US')
  assert.equal(countryName({})(options)('Finland', revState), 'FI')
  assert.equal(countryName({})(options)('Kosovo', revState), 'XK')
})

test('should match country name regardless of case and surrounding spaces in reverse', () => {
  const value = '  nOrWaY '
  const expected = 'NO'
  const ret = countryName({})(options)(value, { ...state, rev: true })

  assert.equal(ret, expected)
})

test('should match country name regardless of accents and punctuation in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(countryName({})(options)("Cote d'Ivoire", revState), 'CI')
  assert.equal(countryName({})(options)('Curacao', revState), 'CW')
  assert.equal(countryName({})(options)('St Kitts & Nevis', revState), 'KN')
})

test('should match & in country name with and in reverse', () => {
  const value = 'Bosnia and Herzegovina'
  const expected = 'BA'
  const ret = countryName({})(options)(value, { ...state, rev: true })

  assert.equal(ret, expected)
})

test('should return current code rather than deprecated code in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(countryName({})(options)('United Kingdom', revState), 'GB')
  assert.equal(countryName({})(options)('Germany', revState), 'DE')
  assert.equal(countryName({})(options)('Russia', revState), 'RU')
  assert.equal(countryName({})(options)('Serbia', revState), 'RS')
})

test('should return country code for name in given locale in reverse', () => {
  const props = { locale: 'nb' }
  const revState = { ...state, rev: true }

  assert.equal(countryName(props)(options)('Sverige', revState), 'SE')
  assert.equal(countryName(props)(options)('USA', revState), 'US')
  assert.equal(countryName(props)(options)('Østerrike', revState), 'AT')
})

test('should use English for invalid locale in reverse', () => {
  const props = { locale: 'not a locale!' }
  const value = 'Norway'
  const expected = 'NO'
  const ret = countryName(props)(options)(value, { ...state, rev: true })

  assert.equal(ret, expected)
})

test('should return undefined for unknown country name in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(countryName({})(options)('Atlantis', revState), undefined)
  assert.equal(countryName({})(options)('', revState), undefined)
  assert.equal(countryName({})(options)('NO', revState), undefined)
})

test('should return code for reserved names that are not countries in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(countryName({})(options)('European Union', revState), 'EU')
  assert.equal(countryName({})(options)('Eurozone', revState), 'EZ')
  assert.equal(countryName({})(options)('United Nations', revState), 'UN')
  assert.equal(countryName({})(options)('Outlying Oceania', revState), 'QO')
})

test('should return undefined for unknown region and pseudo names in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(countryName({})(options)('Unknown Region', revState), undefined)
  assert.equal(countryName({})(options)('Pseudo-Accents', revState), undefined)
  assert.equal(countryName({})(options)('Pseudo-Bidi', revState), undefined)
})

test('should return undefined for non-strings in reverse', () => {
  const revState = { ...state, rev: true }

  assert.equal(countryName({})(options)(3, revState), undefined)
  assert.equal(countryName({})(options)(null, revState), undefined)
  assert.equal(countryName({})(options)({}, revState), undefined)
})

test('should return country codes for array of names in reverse', () => {
  const value = ['Norway', 'Finland']
  const expected = ['NO', 'FI']
  const ret = countryName({})(options)(value, { ...state, rev: true })

  assert.deepEqual(ret, expected)
})

test('should return country code going forward when flipped', () => {
  const value = 'Norway'
  const expected = 'NO'
  const ret = countryName({})(options)(value, { ...state, flip: true })

  assert.equal(ret, expected)
})

test('should return country name in reverse when flipped', () => {
  const value = 'NO'
  const expected = 'Norway'
  const ret = countryName({})(options)(value, {
    ...state,
    rev: true,
    flip: true,
  })

  assert.equal(ret, expected)
})
