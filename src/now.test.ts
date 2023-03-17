import test from 'ava'

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

test('should return the current date', (t) => {
  const before = Date.now()
  const ret = now(operands)(options)(undefined, context)
  const after = Date.now()

  t.true(ret instanceof Date)
  t.true((ret as Date).getTime() >= before)
  t.true((ret as Date).getTime() <= after)
})

test('should override any value from the pipeline', (t) => {
  const ret = now(operands)(options)({ text: 'Lot of stuff' }, context)

  t.true(ret instanceof Date)
})

test('should return the current date in reverse', (t) => {
  const ret = now(operands)(options)(undefined, contextRev)

  t.true(ret instanceof Date)
})
