import test from 'ava'

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

test('should return true when value at path validates', async (t) => {
  const schema = { type: 'string' }
  const path = 'item.value'
  const data = { item: { value: 'theValue' } }

  const ret = await validate({ path, schema })(options)(data, state)

  t.true(ret)
})

test('should return true when value at path validates in reverse', async (t) => {
  const schema = { type: 'string' }
  const path = 'item.value'
  const data = { item: { value: 'theValue' } }

  const ret = await validate({ path, schema })(options)(data, stateRev)

  t.true(ret)
})

test('should return false when value at path fails validation', async (t) => {
  const schema = { type: 'string' }
  const path = 'item.value'
  const data = { item: { value: 3 } }

  const ret = await validate({ path, schema })(options)(data, state)

  t.false(ret)
})

test('should validate entire array', async (t) => {
  const schema = { type: 'array' }
  const path = 'item.value'
  const data = { item: { value: ['firstValue', 'secondValue'] } }

  const ret = await validate({ path, schema })(options)(data, state)

  t.true(ret)
})

test('should validate entiry array items according to json schema sec', async (t) => {
  const schema = { items: { type: 'string' }, type: 'array' }
  const path = 'item.value'
  const data = { item: { value: ['firstValue', 'secondValue'] } }

  const ret = await validate({ path, schema })(options)(data, state)

  t.true(ret)
})

test('should return false when path does not exist on data', async (t) => {
  const schema = { type: 'string' }
  const path = 'item.value'
  const data = {}

  const ret = await validate({ path, schema })(options)(data, state)

  t.false(ret)
})

test('should return true for non-existing path when schema still validates', async (t) => {
  const schema = {}
  const path = 'item.value'
  const data = {}

  const ret = await validate({ path, schema })(options)(data, state)

  t.true(ret)
})

test('should return true when given no schema', async (t) => {
  const schema = undefined
  const path = 'item.value'
  const data = { item: { value: 'theValue' } }

  const ret = await validate({ path, schema })(options)(data, state)

  t.true(ret)
})

test('should return true when schema is true', async (t) => {
  const schema = true
  const path = 'item.value'
  const data = { item: { value: 'theValue' } }

  const ret = await validate({ path, schema })(options)(data, state)

  t.true(ret)
})
