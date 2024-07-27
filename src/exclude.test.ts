import test from 'node:test'
import assert from 'node:assert/strict'

import exclude from './exclude.js'

// Setup

const options = {}
const context = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should exclude items from one array when found in the other', async () => {
  const path = 'allIds'
  const excludePath = 'removedIds'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: ['ent1'] }
  const expected = ['ent2', 'ent3']

  const ret = await exclude({ path, excludePath })(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should exclude value when excludePath points at non-array', async () => {
  const path = 'allIds'
  const excludePath = 'removedIds'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: 'ent1' }
  const expected = ['ent2', 'ent3']

  const ret = await exclude({ path, excludePath })(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should exclude value when path points at non-array', async () => {
  const path = 'allIds'
  const excludePath = 'removedIds'
  const data = { allIds: 'ent1', removedIds: ['ent1', 'ent2'] }
  const expected: [] = []

  const ret = await exclude({ path, excludePath })(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should return empty array when unknown path', async () => {
  const path = 'unknown'
  const excludePath = 'removeIds'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: ['ent1'] }
  const expected: [] = []

  const ret = await exclude({ path, excludePath })(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should skip unknown exclude path', async () => {
  const path = 'allIds'
  const excludePath = 'unknown'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: ['ent1'] }
  const expected = ['ent1', 'ent2', 'ent3']

  const ret = await exclude({ path, excludePath })(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should return empty array when no paths', async () => {
  const data = { ids: ['ent1', 'ent2'] }
  const expected: unknown[] = []

  const ret = await exclude({})(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should not exclude when no exclude path', async () => {
  const path = 'allIds'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: ['ent1'] }
  const expected = ['ent1', 'ent2', 'ent3']

  const ret = await exclude({ path })(options)(data, context)

  assert.deepEqual(ret, expected)
})
