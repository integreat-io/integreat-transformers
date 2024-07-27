import test from 'node:test'
import assert from 'node:assert/strict'

import now from './now.js'

// Setup

const operands = {}
const options = {}
const context = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}
const contextRev = {
  rev: true,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return the current date', () => {
  const before = Date.now()
  const ret = now(operands)(options)(undefined, context)
  const after = Date.now()

  assert(ret instanceof Date)
  assert((ret as Date).getTime() >= before)
  assert((ret as Date).getTime() <= after)
})

test('should override any value from the pipeline', () => {
  const ret = now(operands)(options)({ text: 'Lot of stuff' }, context)

  assert(ret instanceof Date)
})

test('should return the current date in reverse', () => {
  const ret = now(operands)(options)(undefined, contextRev)

  assert(ret instanceof Date)
})
