import test from 'ava'

import range from './range.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false, // Will apply in both directions
  context: [],
  value: {},
}

// Tests

test('should split number range into integers', async (t) => {
  const start = 5
  const end = 13
  const expected = [5, 6, 7, 8, 9, 10, 11, 12]

  const ret = await range({ start, end })(options)(undefined, state)

  t.deepEqual(ret, expected)
})

test('should split number range into integers including end', async (t) => {
  const start = 5
  const end = 13
  const includeEnd = true
  const expected = [5, 6, 7, 8, 9, 10, 11, 12, 13]

  const ret = await range({ start, end, includeEnd })(options)(undefined, state)

  t.deepEqual(ret, expected)
})

test('should split number range with step', async (t) => {
  const start = 5
  const end = 13
  const step = 2
  const expected = [5, 7, 9, 11]

  const ret = await range({ start, end, step })(options)(undefined, state)

  t.deepEqual(ret, expected)
})

test('should split number range with step and including end', async (t) => {
  const start = 5
  const end = 13
  const step = 2
  const includeEnd = true
  const expected = [5, 7, 9, 11, 13]

  const ret = await range({ start, end, step, includeEnd })(options)(
    undefined,
    state
  )

  t.deepEqual(ret, expected)
})

test('should split number range from paths', async (t) => {
  const value = { first: 5, last: 13, width: 4 }
  const startPath = 'first'
  const endPath = 'last'
  const stepPath = 'width'
  const includeEnd = true
  const expected = [5, 9, 13]

  const ret = await range({ startPath, endPath, stepPath, includeEnd })(
    options
  )(value, state)

  t.deepEqual(ret, expected)
})

test('should split number range from paths when given as strings', async (t) => {
  const value = { first: '5', last: '13', width: '4' }
  const startPath = 'first'
  const endPath = 'last'
  const stepPath = 'width'
  const includeEnd = true
  const expected = [5, 9, 13]

  const ret = await range({ startPath, endPath, stepPath, includeEnd })(
    options
  )(value, state)

  t.deepEqual(ret, expected)
})

test('should use values as default when paths yields no number', async (t) => {
  const value = { first: 'Begin here', last: 'Done', width: 'Sooo wide' }
  const start = 5
  const startPath = 'first'
  const end = 13
  const endPath = 'last'
  const step = 4
  const stepPath = 'width'
  const includeEnd = true
  const expected = [5, 9, 13]

  const ret = await range({
    start,
    startPath,
    end,
    endPath,
    step,
    stepPath,
    includeEnd,
  })(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should return undefined when no start or end', async (t) => {
  const start = undefined
  const end = undefined
  const expected = undefined

  const ret = await range({ start, end })(options)(undefined, state)

  t.is(ret, expected)
})
