import test from 'node:test'
import assert from 'node:assert/strict'

import math from './math.js'

// Setup

const options = {}
const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}
const stateRev = {
  rev: true,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests -- forward

test('should add 1 to value', async () => {
  const props = { operator: 'add', value: 1 }
  const value = 5
  const expected = 6

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should add 1 to value in array', async () => {
  const props = { operator: 'add', value: 1 }
  const value = [5, 8]
  const expected = [6, 9]

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should subtract 1 from value', async () => {
  const props = { operator: 'subtract', value: 1 }
  const value = 5
  const expected = 4

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should subtract the value from 1', async () => {
  const props = { operator: 'subtract', value: 1, flip: true }
  const value = 5
  const expected = -4

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should multiply by 5', async () => {
  const props = { operator: 'multiply', value: 5 }
  const value = 7
  const expected = 35

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should divide by 100', async () => {
  const props = { operator: 'divide', value: 100 }
  const value = 5831
  const expected = 58.31

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should divide 100 by the pipeline value', async () => {
  const props = { operator: 'divide', value: 100, flip: true }
  const value = 5
  const expected = 20

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should use path to get pipeline value', async () => {
  const props = { operator: 'add', path: 'meta.index', value: 1 }
  const value = { meta: { index: 5 } }
  const expected = 6

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should use path to get value', async () => {
  const props = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200, discount: 0.25 }
  const expected = 50

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should convert value from path to float', async () => {
  const props = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200, discount: '0.25' }
  const expected = 50

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should use value prop if path yields no number', async () => {
  const props = {
    operator: 'multiply',
    path: 'price',
    value: 0.25,
    valuePath: 'discount',
  }
  const value = { price: 200, discount: 'This is no discount!' }
  const expected = 50

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should apply the oposite operator going forward', async () => {
  const props = { operator: 'add', value: 1, rev: true }
  const value = 5
  const expected = 4

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should cast value to number when posible', async () => {
  const props = { operator: 'add', value: 1 }
  const value = '5'
  const expected = 6

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should do nothing when operand value is not a number', async () => {
  const props = { operator: 'subtract', value: undefined }
  const value = 5
  const expected = 5

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined when operand value gotten from path is not a number', async () => {
  const props = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200 }
  const expected = undefined

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should do nothing for unknown operator', async () => {
  const props = { operator: 'domagic', value: 1 }
  const value = 5
  const expected = 5

  const ret = await math(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined when not a number', async () => {
  const props = { operator: 'add', value: 1 }

  assert.deepEqual(await math(props)(options)('Three', state), undefined)
  assert.deepEqual(await math(props)(options)(true, state), undefined)
  assert.deepEqual(await math(props)(options)(new Date(), state), undefined)
  assert.deepEqual(await math(props)(options)(null, state), undefined)
  assert.deepEqual(await math(props)(options)(undefined, state), undefined)
})

test('should return undefined when not a number and operand value is not a number', async () => {
  const props = { operator: 'add', value: undefined }

  assert.deepEqual(await math(props)(options)('Three', state), undefined)
})

test('should act like reverse going forward when flipped', async () => {
  const stateFlipped = { ...state, flip: true }
  const props = { operator: 'add', value: 1 }
  const value = 5
  const expected = 4

  const ret = await math(props)(options)(value, stateFlipped)

  assert.deepEqual(ret, expected)
})

// Tests -- reverse

test('should remove 1 from value in reverse', async () => {
  const props = { operator: 'add', value: 1 }
  const value = 5
  const expected = 4

  const ret = await math(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should remove value from 1 in reverse', async () => {
  const props = { operator: 'add', value: 1, flip: true }
  const value = 5
  const expected = -4

  const ret = await math(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should add 1 to value in reverse', async () => {
  const props = { operator: 'subtract', value: 1 }
  const value = 5
  const expected = 6

  const ret = await math(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should divide by 5 in reverse', async () => {
  const props = { operator: 'multiply', value: 5 }
  const value = 35
  const expected = 7

  const ret = await math(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should divide 5 by value in reverse', async () => {
  const props = { operator: 'multiply', value: 5, flip: true }
  const value = 10
  const expected = 0.5

  const ret = await math(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should multiply by 100 in reverse', async () => {
  const props = { operator: 'divide', value: 100 }
  const value = 58.31
  const expected = 5831

  const ret = await math(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should apply the defined operator in reverse', async () => {
  const props = { operator: 'add', value: 1, rev: true }
  const value = 5
  const expected = 6

  const ret = await math(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should act like forward in reverse when flipped', async () => {
  const stateFlipped = { ...stateRev, flip: true }
  const props = { operator: 'add', value: 1 }
  const value = 5
  const expected = 6

  const ret = await math(props)(options)(value, stateFlipped)

  assert.deepEqual(ret, expected)
})
