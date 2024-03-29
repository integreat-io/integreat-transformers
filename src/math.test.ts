import test from 'ava'

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

test('should add 1 to value', async (t) => {
  const props = { operator: 'add', value: 1 }
  const value = 5
  const expected = 6

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should add 1 to value in array', async (t) => {
  const props = { operator: 'add', value: 1 }
  const value = [5, 8]
  const expected = [6, 9]

  const ret = await math(props)(options)(value, state)

  t.deepEqual(ret, expected)
})

test('should subtract 1 from value', async (t) => {
  const props = { operator: 'subtract', value: 1 }
  const value = 5
  const expected = 4

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should subtract the value from 1', async (t) => {
  const props = { operator: 'subtract', value: 1, flip: true }
  const value = 5
  const expected = -4

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should multiply by 5', async (t) => {
  const props = { operator: 'multiply', value: 5 }
  const value = 7
  const expected = 35

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should divide by 100', async (t) => {
  const props = { operator: 'divide', value: 100 }
  const value = 5831
  const expected = 58.31

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should divide 100 by the pipeline value', async (t) => {
  const props = { operator: 'divide', value: 100, flip: true }
  const value = 5
  const expected = 20

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should use path to get pipeline value', async (t) => {
  const props = { operator: 'add', path: 'meta.index', value: 1 }
  const value = { meta: { index: 5 } }
  const expected = 6

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should use path to get value', async (t) => {
  const props = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200, discount: 0.25 }
  const expected = 50

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should convert value from path to float', async (t) => {
  const props = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200, discount: '0.25' }
  const expected = 50

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should use value prop if path yields no number', async (t) => {
  const props = {
    operator: 'multiply',
    path: 'price',
    value: 0.25,
    valuePath: 'discount',
  }
  const value = { price: 200, discount: 'This is no discount!' }
  const expected = 50

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should apply the oposite operator going forward', async (t) => {
  const props = { operator: 'add', value: 1, rev: true }
  const value = 5
  const expected = 4

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should cast value to number when posible', async (t) => {
  const props = { operator: 'add', value: 1 }
  const value = '5'
  const expected = 6

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should do nothing when operand value is not a number', async (t) => {
  const props = { operator: 'subtract', value: undefined }
  const value = 5
  const expected = 5

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should return undefined when operand value gotten from path is not a number', async (t) => {
  const props = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200 }
  const expected = undefined

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should do nothing for unknown operator', async (t) => {
  const props = { operator: 'domagic', value: 1 }
  const value = 5
  const expected = 5

  const ret = await math(props)(options)(value, state)

  t.is(ret, expected)
})

test('should return undefined when not a number', async (t) => {
  const props = { operator: 'add', value: 1 }

  t.is(await math(props)(options)('Three', state), undefined)
  t.is(await math(props)(options)(true, state), undefined)
  t.is(await math(props)(options)(new Date(), state), undefined)
  t.is(await math(props)(options)(null, state), undefined)
  t.is(await math(props)(options)(undefined, state), undefined)
})

test('should return undefined when not a number and operand value is not a number', async (t) => {
  const props = { operator: 'add', value: undefined }

  t.is(await math(props)(options)('Three', state), undefined)
})

test('should act like reverse going forward when flipped', async (t) => {
  const stateFlipped = { ...state, flip: true }
  const props = { operator: 'add', value: 1 }
  const value = 5
  const expected = 4

  const ret = await math(props)(options)(value, stateFlipped)

  t.is(ret, expected)
})

// Tests -- reverse

test('should remove 1 from value in reverse', async (t) => {
  const props = { operator: 'add', value: 1 }
  const value = 5
  const expected = 4

  const ret = await math(props)(options)(value, stateRev)

  t.is(ret, expected)
})

test('should remove value from 1 in reverse', async (t) => {
  const props = { operator: 'add', value: 1, flip: true }
  const value = 5
  const expected = -4

  const ret = await math(props)(options)(value, stateRev)

  t.is(ret, expected)
})

test('should add 1 to value in reverse', async (t) => {
  const props = { operator: 'subtract', value: 1 }
  const value = 5
  const expected = 6

  const ret = await math(props)(options)(value, stateRev)

  t.is(ret, expected)
})

test('should divide by 5 in reverse', async (t) => {
  const props = { operator: 'multiply', value: 5 }
  const value = 35
  const expected = 7

  const ret = await math(props)(options)(value, stateRev)

  t.is(ret, expected)
})

test('should divide 5 by value in reverse', async (t) => {
  const props = { operator: 'multiply', value: 5, flip: true }
  const value = 10
  const expected = 0.5

  const ret = await math(props)(options)(value, stateRev)

  t.is(ret, expected)
})

test('should multiply by 100 in reverse', async (t) => {
  const props = { operator: 'divide', value: 100 }
  const value = 58.31
  const expected = 5831

  const ret = await math(props)(options)(value, stateRev)

  t.is(ret, expected)
})

test('should apply the defined operator in reverse', async (t) => {
  const props = { operator: 'add', value: 1, rev: true }
  const value = 5
  const expected = 6

  const ret = await math(props)(options)(value, stateRev)

  t.is(ret, expected)
})

test('should act like forward in reverse when flipped', async (t) => {
  const stateFlipped = { ...stateRev, flip: true }
  const props = { operator: 'add', value: 1 }
  const value = 5
  const expected = 6

  const ret = await math(props)(options)(value, stateFlipped)

  t.is(ret, expected)
})
