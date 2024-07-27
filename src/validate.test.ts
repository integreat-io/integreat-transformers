import test from 'node:test'
import assert from 'node:assert/strict'

import validate from './validate.js'

// Setup

const state = {
  rev: false,
  noDefaults: false,
  context: [],
  value: {},
}

const stateRev = {
  rev: true,
  noDefaults: false,
  context: [],
  value: {},
}

const options = {}

// Test

test('should return true when value at path validates', async () => {
  const schema = { type: 'string' }
  const path = 'item.value'
  const data = { item: { value: 'theValue' } }

  const ret = await validate({ path, schema })(options)(data, state)

  assert.equal(ret, true)
})

test('should return true when value at path validates in reverse', async () => {
  const schema = { type: 'string' }
  const path = 'item.value'
  const data = { item: { value: 'theValue' } }

  const ret = await validate({ path, schema })(options)(data, stateRev)

  assert.equal(ret, true)
})

test('should return false when value at path fails validation', async () => {
  const schema = { type: 'string' }
  const path = 'item.value'
  const data = { item: { value: 3 } }

  const ret = await validate({ path, schema })(options)(data, state)

  assert.equal(ret, false)
})

test('should validate entire array', async () => {
  const schema = { type: 'array' }
  const path = 'item.value'
  const data = { item: { value: ['firstValue', 'secondValue'] } }

  const ret = await validate({ path, schema })(options)(data, state)

  assert.equal(ret, true)
})

test('should validate entiry array items according to json schema sec', async () => {
  const schema = { items: { type: 'string' }, type: 'array' }
  const path = 'item.value'
  const data = { item: { value: ['firstValue', 'secondValue'] } }

  const ret = await validate({ path, schema })(options)(data, state)

  assert.equal(ret, true)
})

test('should return false when path does not exist on data', async () => {
  const schema = { type: 'string' }
  const path = 'item.value'
  const data = {}

  const ret = await validate({ path, schema })(options)(data, state)

  assert.equal(ret, false)
})

test('should return true for non-existing path when schema still validates', async () => {
  const schema = {}
  const path = 'item.value'
  const data = {}

  const ret = await validate({ path, schema })(options)(data, state)

  assert.equal(ret, true)
})

test('should return true when given no schema', async () => {
  const schema = undefined
  const path = 'item.value'
  const data = { item: { value: 'theValue' } }

  const ret = await validate({ path, schema })(options)(data, state)

  assert.equal(ret, true)
})

test('should return true when schema is true', async () => {
  const schema = true
  const path = 'item.value'
  const data = { item: { value: 'theValue' } }

  const ret = await validate({ path, schema })(options)(data, state)

  assert.equal(ret, true)
})
