import test from 'ava'

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

test('should exclude items from one array when found in the other', (t) => {
  const path = 'allIds'
  const excludePath = 'removedIds'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: ['ent1'] }
  const expected = ['ent2', 'ent3']

  const ret = exclude({ path, excludePath })(options)(data, context)

  t.deepEqual(ret, expected)
})

test('should exclude value when excludePath points at non-array', (t) => {
  const path = 'allIds'
  const excludePath = 'removedIds'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: 'ent1' }
  const expected = ['ent2', 'ent3']

  const ret = exclude({ path, excludePath })(options)(data, context)

  t.deepEqual(ret, expected)
})

test('should exclude value when path points at non-array', (t) => {
  const path = 'allIds'
  const excludePath = 'removedIds'
  const data = { allIds: 'ent1', removedIds: ['ent1', 'ent2'] }
  const expected: [] = []

  const ret = exclude({ path, excludePath })(options)(data, context)

  t.deepEqual(ret, expected)
})

test('should return empty array when unknown path', (t) => {
  const path = 'unknown'
  const excludePath = 'removeIds'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: ['ent1'] }
  const expected: [] = []

  const ret = exclude({ path, excludePath })(options)(data, context)

  t.deepEqual(ret, expected)
})

test('should skip unknown exclude path', (t) => {
  const path = 'allIds'
  const excludePath = 'unknown'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: ['ent1'] }
  const expected = ['ent1', 'ent2', 'ent3']

  const ret = exclude({ path, excludePath })(options)(data, context)

  t.deepEqual(ret, expected)
})

test('should return empty array when no paths', (t) => {
  const data = { ids: ['ent1', 'ent2'] }
  const expected: unknown[] = []

  const ret = exclude({})(options)(data, context)

  t.deepEqual(ret, expected)
})

test('should not exclude when no exclude path', (t) => {
  const path = 'allIds'
  const data = { allIds: ['ent1', 'ent2', 'ent3'], removedIds: ['ent1'] }
  const expected = ['ent1', 'ent2', 'ent3']

  const ret = exclude({ path })(options)(data, context)

  t.deepEqual(ret, expected)
})
