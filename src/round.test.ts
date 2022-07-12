import test from 'ava'

import round from './round'

// Setup

const state = {
  rev: false,
  onlyMappedValues: false, // Will apply in both directions
  root: {},
  context: {},
  value: {},
}

// Tests

test('should round floats to two decimals', (t) => {
  const round2 = round({ precision: 2 })

  t.is(round2(18.4211, state), 18.42)
  t.is(round2(18.42, state), 18.42)
  t.is(round2(18.3, state), 18.3)
  t.is(round2(18, state), 18)
  t.is(round2(18.3352, state), 18.34)
  t.is(round2(-18.3352, state), -18.34)
})

test('should round floats to three decimals', (t) => {
  const round3 = round({ precision: 3 })

  t.is(round3(18.4211, state), 18.421)
  t.is(round3(18.42, state), 18.42)
  t.is(round3(18.3, state), 18.3)
  t.is(round3(18, state), 18)
  t.is(round3(18.3352, state), 18.335)
  t.is(round3(-18.3352, state), -18.335)
})

test('should round to integer as default', (t) => {
  t.is(round({})(18.4211, state), 18)
  t.is(round({})(-3.5, state), -4)
})

test('should round towards positive infinity', (t) => {
  const roundInfinity2 = round({ roundTowardsInfinity: true, precision: 2 })
  const roundInfinity0 = round({ roundTowardsInfinity: true, precision: 0 })

  t.is(roundInfinity2(-18.425, state), -18.42)
  t.is(roundInfinity2(18.425, state), 18.43)
  t.is(roundInfinity0(-3.5, state), -3)
})

test('should always round down', (t) => {
  const floor = round({ precision: 'floor' })

  t.is(floor(18.844, state), 18)
  t.is(floor(18.4211, state), 18)
  t.is(floor(-18.844, state), -19)
  t.is(floor(-18.4211, state), -19)
})

test('should always round up', (t) => {
  const floor = round({ precision: 'ceil' })

  t.is(floor(18.844, state), 19)
  t.is(floor(18.4211, state), 19)
  t.is(floor(-18.844, state), -18)
  t.is(floor(-18.4211, state), -18)
})

test('should parse number from string', (t) => {
  const round2 = round({ precision: 2 })

  t.is(round2('18.4211', state), 18.42)
  t.is(round2('18', state), 18)
  t.is(round2('18.3352', state), 18.34)
  t.is(round2('-18.3352', state), -18.34)
})

test('should return undefined for other types', (t) => {
  const round2 = round({ precision: 2 })

  t.is(round2('not number', state), undefined)
  t.is(round2(true, state), undefined)
  t.is(round2(new Date(), state), undefined)
  t.is(round2(null, state), undefined)
  t.is(round2(undefined, state), undefined)
})
