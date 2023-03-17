import test from 'ava'

import math from './math.js'

// Setup

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

// Tests -- forward

test('should add 1 to value', (t) => {
  const operands = { operator: 'add', value: 1 }
  const value = 5
  const expected = 6

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should subtract 1 from value', (t) => {
  const operands = { operator: 'subtract', value: 1 }
  const value = 5
  const expected = 4

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should subtract the value from 1', (t) => {
  const operands = { operator: 'subtract', value: 1, flip: true }
  const value = 5
  const expected = -4

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should multiply by 5', (t) => {
  const operands = { operator: 'multiply', value: 5 }
  const value = 7
  const expected = 35

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should divide by 100', (t) => {
  const operands = { operator: 'divide', value: 100 }
  const value = 5831
  const expected = 58.31

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should divide 100 by the pipeline value', (t) => {
  const operands = { operator: 'divide', value: 100, flip: true }
  const value = 5
  const expected = 20

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should use path to get pipeline value', (t) => {
  const operands = { operator: 'add', path: 'meta.index', value: 1 }
  const value = { meta: { index: 5 } }
  const expected = 6

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should use path to get value', (t) => {
  const operands = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200, discount: 0.25 }
  const expected = 50

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should convert value from path to float', (t) => {
  const operands = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200, discount: '0.25' }
  const expected = 50

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should use value prop if path yields no number', (t) => {
  const operands = {
    operator: 'multiply',
    path: 'price',
    value: 0.25,
    valuePath: 'discount',
  }
  const value = { price: 200, discount: 'This is no discount!' }
  const expected = 50

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should apply the oposite operator going forward', (t) => {
  const operands = { operator: 'add', value: 1, rev: true }
  const value = 5
  const expected = 4

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should cast value to number when posible', (t) => {
  const operands = { operator: 'add', value: 1 }
  const value = '5'
  const expected = 6

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should do nothing when operand value is not a number', (t) => {
  const operands = { operator: 'subtract', value: undefined }
  const value = 5
  const expected = 5

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should return undefined when operand value gotten from path is not a number', (t) => {
  const operands = {
    operator: 'multiply',
    path: 'price',
    valuePath: 'discount',
  }
  const value = { price: 200 }
  const expected = undefined

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should do nothing for unknown operator', (t) => {
  const operands = { operator: 'domagic', value: 1 }
  const value = 5
  const expected = 5

  const ret = math(operands)(options)(value, context)

  t.is(ret, expected)
})

test('should return undefined when not a number', (t) => {
  const operands = { operator: 'add', value: 1 }

  t.is(math(operands)(options)('Three', context), undefined)
  t.is(math(operands)(options)(true, context), undefined)
  t.is(math(operands)(options)(new Date(), context), undefined)
  t.is(math(operands)(options)(null, context), undefined)
  t.is(math(operands)(options)(undefined, context), undefined)
})

test('should return undefined when not a number and operand value is not a number', (t) => {
  const operands = { operator: 'add', value: undefined }

  t.is(math(operands)(options)('Three', context), undefined)
})

// Tests -- reverse

test('should remove 1 from value in reverse', (t) => {
  const operands = { operator: 'add', value: 1 }
  const value = 5
  const expected = 4

  const ret = math(operands)(options)(value, contextRev)

  t.is(ret, expected)
})

test('should remove value from 1 in reverse', (t) => {
  const operands = { operator: 'add', value: 1, flip: true }
  const value = 5
  const expected = -4

  const ret = math(operands)(options)(value, contextRev)

  t.is(ret, expected)
})

test('should add 1 to value in reverse', (t) => {
  const operands = { operator: 'subtract', value: 1 }
  const value = 5
  const expected = 6

  const ret = math(operands)(options)(value, contextRev)

  t.is(ret, expected)
})

test('should divide by 5 in reverse', (t) => {
  const operands = { operator: 'multiply', value: 5 }
  const value = 35
  const expected = 7

  const ret = math(operands)(options)(value, contextRev)

  t.is(ret, expected)
})

test('should divide 5 by value in reverse', (t) => {
  const operands = { operator: 'multiply', value: 5, flip: true }
  const value = 10
  const expected = 0.5

  const ret = math(operands)(options)(value, contextRev)

  t.is(ret, expected)
})

test('should multiply by 100 in reverse', (t) => {
  const operands = { operator: 'divide', value: 100 }
  const value = 58.31
  const expected = 5831

  const ret = math(operands)(options)(value, contextRev)

  t.is(ret, expected)
})

test('should apply the defined operator in reverse', (t) => {
  const operands = { operator: 'add', value: 1, rev: true }
  const value = 5
  const expected = 6

  const ret = math(operands)(options)(value, contextRev)

  t.is(ret, expected)
})
