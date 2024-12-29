import test from 'node:test'
import assert from 'node:assert/strict'

import transformer from './type.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

const stateRev = { ...state, rev: true }

// Tests -- forward

test('should return the type a value', () => {
  assert.equal(transformer({})(options)('I am a string', state), 'string')
  assert.equal(transformer({})(options)(32, state), 'number')
  assert.equal(transformer({})(options)(32.4, state), 'number')
  assert.equal(transformer({})(options)(true, state), 'boolean')
  assert.equal(transformer({})(options)(false, state), 'boolean')
  assert.equal(transformer({})(options)(new Date(), state), 'date')
  assert.equal(transformer({})(options)({}, state), 'object')
  assert.equal(transformer({})(options)(null, state), 'null')
  assert.equal(transformer({})(options)(undefined, state), 'undefined')
})

// Tests -- reverse

test('should return the type a value in reverse', () => {
  assert.equal(transformer({})(options)('I am a string', stateRev), 'string')
  assert.equal(transformer({})(options)(32, stateRev), 'number')
  assert.equal(transformer({})(options)(32.4, stateRev), 'number')
  assert.equal(transformer({})(options)(true, stateRev), 'boolean')
  assert.equal(transformer({})(options)(false, stateRev), 'boolean')
  assert.equal(transformer({})(options)(new Date(), stateRev), 'date')
  assert.equal(transformer({})(options)({}, stateRev), 'object')
  assert.equal(transformer({})(options)(null, stateRev), 'null')
  assert.equal(transformer({})(options)(undefined, stateRev), 'undefined')
})
