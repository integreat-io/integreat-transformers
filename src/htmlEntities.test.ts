import test from 'node:test'
import assert from 'node:assert/strict'

import htmlEntities from './htmlEntities.js'

// Setup

const props = {}
const options = {}
const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}
const stateRev = {
  rev: true,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests -- forward

test('should decode html entities in text going forward', () => {
  const value = 'foo &copy; bar &#8800; baz &#x1D306; qux'
  const expected = 'foo © bar ≠ baz 𝌆 qux'

  const ret = htmlEntities(props)(options)(value, state)

  assert.equal(ret, expected)
})

test('should not be affected by flip going forward', () => {
  const stateFlipped = { ...state, flip: true }
  const value = 'foo &copy; bar &#8800; baz &#x1D306; qux'
  const expected = 'foo © bar ≠ baz 𝌆 qux'

  const ret = htmlEntities(props)(options)(value, stateFlipped)

  assert.equal(ret, expected)
})

test('should force values to string going forward', () => {
  assert.equal(htmlEntities(props)(options)(3, state), '3')
  assert.equal(htmlEntities(props)(options)(true, state), 'true')
  assert.equal(
    htmlEntities(props)(options)(new Date('2020-08-12T13:15:43Z'), state),
    '2020-08-12T13:15:43.000Z',
  )
})

test('should return undefined for some values going forward', () => {
  assert.equal(htmlEntities(props)(options)({}, state), undefined)
  assert.equal(htmlEntities(props)(options)(null, state), undefined)
  assert.equal(htmlEntities(props)(options)(undefined, state), undefined)
})

// Tests -- reverse

test('should encode html entities in text in reverse', () => {
  const value = 'foo © bar ≠ baz 𝌆 qux'
  const expected = 'foo &copy; bar &ne; baz &#x1D306; qux'

  const ret = htmlEntities(props)(options)(value, stateRev)

  assert.equal(ret, expected)
})

test('should not be affected by flip in reverse', () => {
  const stateFlipped = { ...stateRev, flip: true }
  const value = 'foo © bar ≠ baz 𝌆 qux'
  const expected = 'foo &copy; bar &ne; baz &#x1D306; qux'

  const ret = htmlEntities(props)(options)(value, stateFlipped)

  assert.equal(ret, expected)
})

test('should force values to string in reverse', () => {
  assert.equal(htmlEntities(props)(options)(3, stateRev), '3')
  assert.equal(htmlEntities(props)(options)(true, stateRev), 'true')
  assert.equal(
    htmlEntities(props)(options)(new Date('2020-08-12T13:15:43Z'), stateRev),
    '2020-08-12T13:15:43.000Z',
  )
})

test('should return undefined for some values in reverse', () => {
  assert.equal(htmlEntities(props)(options)({}, stateRev), undefined)
  assert.equal(htmlEntities(props)(options)(null, stateRev), undefined)
  assert.equal(htmlEntities(props)(options)(undefined, stateRev), undefined)
})
