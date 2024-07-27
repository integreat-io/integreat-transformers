import test from 'node:test'
import assert from 'node:assert/strict'

import csv from './csv.js'

// Setup

const options = {}

const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}
const stateRev = {
  ...state,
  rev: true,
}

const commaString = `"1","Several words here","39"
"2","And more here","45"
"3","Even more","81"
`

const semicolonString = `1;Several words here;39
2;And more here;45
3;Even more;81
`

// Tests -- from service

test('should normalize basic csv data', () => {
  const data = commaString
  const expected = [
    { col1: '1', col2: 'Several words here', col3: '39' },
    { col1: '2', col2: 'And more here', col3: '45' },
    { col1: '3', col2: 'Even more', col3: '81' },
  ]

  const ret = csv({})(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should normalize with semicolon', () => {
  const data = semicolonString
  const expected = [
    { col1: '1', col2: 'Several words here', col3: '39' },
    { col1: '2', col2: 'And more here', col3: '45' },
    { col1: '3', col2: 'Even more', col3: '81' },
  ]

  const ret = csv({ delimiter: ';' })(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should normalize with customized column prefix', () => {
  const data = commaString
  const expected = [
    { field_1: '1', field_2: 'Several words here', field_3: '39' },
    { field_1: '2', field_2: 'And more here', field_3: '45' },
    { field_1: '3', field_2: 'Even more', field_3: '81' },
  ]

  const ret = csv({ columnPrefix: 'field_' })(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should normalize with header row', () => {
  const data = '"Id","Text","Age"\n' + commaString
  const expected = [
    { Id: '1', Text: 'Several words here', Age: '39' },
    { Id: '2', Text: 'And more here', Age: '45' },
    { Id: '3', Text: 'Even more', Age: '81' },
  ]

  const ret = csv({ headerRow: true })(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should normalize with rows of different number of columns', () => {
  const commaString = `"John F.","45","Fjonveien 18"
    "Mary K.","52","Kvølstadbakken 11","911 88 123","true"
    "Simon P.","23","Praiestakken 21A","904 13 411"`
  const data = commaString
  const expected = [
    { col1: 'John F.', col2: '45', col3: 'Fjonveien 18' },
    {
      col1: 'Mary K.',
      col2: '52',
      col3: 'Kvølstadbakken 11',
      col4: '911 88 123',
      col5: 'true',
    },
    {
      col1: 'Simon P.',
      col2: '23',
      col3: 'Praiestakken 21A',
      col4: '904 13 411',
    },
  ]

  const ret = csv({})(options)(data, state)

  assert.deepEqual(ret, expected)
})

// Note: This might not be wanted behavior, but it's what we can do for now
test('should return undefined when csv string is invalid', () => {
  const data = '"invalid","csv"\n"file","'

  const ret = csv({})(options)(data, state)

  assert.deepEqual(ret, undefined)
})

test('return undefined when data is not a string', async () => {
  assert.deepEqual(csv({})(options)({}, state), undefined)
  assert.deepEqual(csv({})(options)(3, state), undefined)
  assert.deepEqual(csv({})(options)(true, state), undefined)
  assert.deepEqual(csv({})(options)(new Date(), state), undefined)
  assert.deepEqual(csv({})(options)(null, state), undefined)
  assert.deepEqual(csv({})(options)(undefined, state), undefined)
})

test('should serialize from service when direction is from', () => {
  const direction = 'from'
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = commaString

  const ret = csv({ direction })(options)(data, state)

  assert.deepEqual(ret, expectedData)
})

test('should serialize array of data from service when flipped', () => {
  const stateFlipped = { ...state, flip: true }
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = commaString

  const ret = csv({})(options)(data, stateFlipped)

  assert.deepEqual(ret, expectedData)
})

// Tests -- to service

test('should serialize array of data', () => {
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = commaString

  const ret = csv({})(options)(data, stateRev)

  assert.deepEqual(ret, expectedData)
})

test('should serialize with semicolons and no quotation marks', () => {
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = semicolonString

  const ret = csv({ quoted: false, delimiter: ';' })(options)(data, stateRev)

  assert.deepEqual(ret, expectedData)
})

test('should include header row', async () => {
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    { value: 2, text: 'And more here', age: 45 },
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = '"value","text","age"\n' + commaString

  const ret = csv({ headerRow: true })(options)(data, stateRev)

  assert.deepEqual(ret, expectedData)
})

test('should serialize data objects with different number of keys', async () => {
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    {
      value: 2,
      text: 'And more here',
      phone: '911 88 123',
      age: 45,
      vip: true,
    },
    { value: 3, text: 'Even more', phone: '904 13 411', age: 81 },
  ]
  const expectedData = `"1","Several words here","39",,
"2","And more here","45","911 88 123","true"
"3","Even more","81","904 13 411",
`

  const ret = csv({})(options)(data, stateRev)

  assert.deepEqual(ret, expectedData)
})

test('should order col-keys and put them before other keys', () => {
  const data = [
    { col2: 'Several words here', age: 39, col1: 1 },
    { age: 45, col2: 'And more here', col1: 2 },
    { col3: true, col2: 'Even more', age: 81, col1: 3 },
  ]
  const expectedData = `"1","Several words here",,"39"
"2","And more here",,"45"
"3","Even more","true","81"
`

  const ret = csv({})(options)(data, stateRev)

  assert.deepEqual(ret, expectedData)
})

test('should expand arrays in place', async () => {
  const data = [
    { age: 39, col1: [1, 'Several words here'] },
    { age: 45, col1: [2, 'And more here'] },
    { age: 81, col1: [3, 'Even more'] },
  ]
  const expectedData = commaString

  const ret = csv({})(options)(data, stateRev)

  assert.deepEqual(ret, expectedData)
})

test('should skip non-objects', async () => {
  const data = [
    { value: 1, text: 'Several words here', age: 39 },
    null,
    { value: 2, text: 'And more here', age: 45 },
    'row!',
    { value: 3, text: 'Even more', age: 81 },
  ]
  const expectedData = commaString

  const ret = csv({})(options)(data, stateRev)

  assert.deepEqual(ret, expectedData)
})

test('return undefined when data is not an array', async () => {
  assert.deepEqual(csv({})(options)('No data', stateRev), undefined)
  assert.deepEqual(csv({})(options)(3, stateRev), undefined)
  assert.deepEqual(csv({})(options)(true, stateRev), undefined)
  assert.deepEqual(csv({})(options)(new Date(), stateRev), undefined)
  assert.deepEqual(csv({})(options)(null, stateRev), undefined)
  assert.deepEqual(csv({})(options)(undefined, stateRev), undefined)
})

test('should normalize to service when direction is from', () => {
  const direction = 'from'
  const data = commaString
  const expected = [
    { col1: '1', col2: 'Several words here', col3: '39' },
    { col1: '2', col2: 'And more here', col3: '45' },
    { col1: '3', col2: 'Even more', col3: '81' },
  ]

  const ret = csv({ direction })(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should normalize basic csv data to service when flipped', () => {
  const stateFlipped = { ...stateRev, flip: true }
  const data = commaString
  const expected = [
    { col1: '1', col2: 'Several words here', col3: '39' },
    { col1: '2', col2: 'And more here', col3: '45' },
    { col1: '3', col2: 'Even more', col3: '81' },
  ]

  const ret = csv({})(options)(data, stateFlipped)

  assert.deepEqual(ret, expected)
})
