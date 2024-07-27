import test from 'node:test'
import assert from 'node:assert/strict'

import round from './round.js'

// Setup

const state = {
  rev: false,
  onlyMappedValues: false, // Will apply in both directions
  context: [],
  value: {},
}

const options = {}

// Tests

test('should round floats to two decimals', () => {
  const round2 = round({ precision: 2 })(options)

  assert.deepEqual(round2(18.4211, state), 18.42)
  assert.deepEqual(round2(18.42, state), 18.42)
  assert.deepEqual(round2(18.3, state), 18.3)
  assert.deepEqual(round2(18, state), 18)
  assert.deepEqual(round2(18.3352, state), 18.34)
  assert.deepEqual(round2(-18.3352, state), -18.34)
})

test('should round floats to three decimals', () => {
  const round3 = round({ precision: 3 })(options)

  assert.deepEqual(round3(18.4211, state), 18.421)
  assert.deepEqual(round3(18.42, state), 18.42)
  assert.deepEqual(round3(18.3, state), 18.3)
  assert.deepEqual(round3(18, state), 18)
  assert.deepEqual(round3(18.3352, state), 18.335)
  assert.deepEqual(round3(-18.3352, state), -18.335)
})

test('should round to integer as default', () => {
  assert.deepEqual(round({})(options)(18.4211, state), 18)
  assert.deepEqual(round({})(options)(-3.5, state), -4)
})

test('should round towards positive infinity', () => {
  const roundInfinity2 = round({ roundTowardsInfinity: true, precision: 2 })(
    options,
  )
  const roundInfinity0 = round({ roundTowardsInfinity: true, precision: 0 })(
    options,
  )

  assert.deepEqual(roundInfinity2(-18.425, state), -18.42)
  assert.deepEqual(roundInfinity2(18.425, state), 18.43)
  assert.deepEqual(roundInfinity0(-3.5, state), -3)
})

test('should always round down', () => {
  const floor = round({ precision: 'floor' })(options)

  assert.deepEqual(floor(18.844, state), 18)
  assert.deepEqual(floor(18.4211, state), 18)
  assert.deepEqual(floor(-18.844, state), -19)
  assert.deepEqual(floor(-18.4211, state), -19)
})

test('should always round up', () => {
  const floor = round({ precision: 'ceil' })(options)

  assert.deepEqual(floor(18.844, state), 19)
  assert.deepEqual(floor(18.4211, state), 19)
  assert.deepEqual(floor(-18.844, state), -18)
  assert.deepEqual(floor(-18.4211, state), -18)
})

test('should parse number from string', () => {
  const round2 = round({ precision: 2 })(options)

  assert.deepEqual(round2('18.4211', state), 18.42)
  assert.deepEqual(round2('18', state), 18)
  assert.deepEqual(round2('18.3352', state), 18.34)
  assert.deepEqual(round2('-18.3352', state), -18.34)
})

test('should return undefined for other types', () => {
  const round2 = round({ precision: 2 })(options)

  assert.deepEqual(round2('not number', state), undefined)
  assert.deepEqual(round2(true, state), undefined)
  assert.deepEqual(round2(new Date(), state), undefined)
  assert.deepEqual(round2(null, state), undefined)
  assert.deepEqual(round2(undefined, state), undefined)
})
