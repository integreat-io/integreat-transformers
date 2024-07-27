import test from 'node:test'
import assert from 'node:assert/strict'

import trim from './trim.js'

// Setup

const operands = {}
const options = {}
const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should trim from service', () => {
  assert.deepEqual(
    trim(operands)(options)(' Space on each side ', state),
    'Space on each side',
  )
  assert.deepEqual(
    trim(operands)(options)(' Space in front', state),
    'Space in front',
  )
  assert.deepEqual(
    trim(operands)(options)('Space on the end ', state),
    'Space on the end',
  )
  assert.deepEqual(trim(operands)(options)('No space', state), 'No space')
  assert.deepEqual(trim(operands)(options)(' ', state), '')
})

test('should not touch things that are not string from service', () => {
  assert.deepEqual(trim(operands)(options)(3, state), 3)
  assert.deepEqual(trim(operands)(options)(true, state), true)
  assert.deepEqual(trim(operands)(options)(null, state), null)
  assert.deepEqual(trim(operands)(options)(undefined, state), undefined)
  assert.deepEqual(trim(operands)(options)({}, state), {})
})
