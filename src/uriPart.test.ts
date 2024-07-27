import test from 'node:test'
import assert from 'node:assert/strict'

import uriPart from './uriPart.js'

// Setup

const operands = {}
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

// Tests

test('should encode uri part going to service', () => {
  const value = "*[_type=='table'&&key==$table][0].fields{key,name,type}"
  const expected =
    "*%5B_type%3D%3D'table'%26%26key%3D%3D%24table%5D%5B0%5D.fields%7Bkey%2Cname%2Ctype%7D"

  const ret = uriPart(operands)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should decode uri part coming from service', () => {
  const value =
    "*%5B_type%3D%3D'table'%26%26key%3D%3D%24table%5D%5B0%5D.fields%7Bkey%2Cname%2Ctype%7D"
  const expected = "*[_type=='table'&&key==$table][0].fields{key,name,type}"

  const ret = uriPart(operands)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should force some value to string going to service', () => {
  assert.deepEqual(uriPart(operands)(options)(3, stateRev), '3')
  assert.deepEqual(uriPart(operands)(options)(true, stateRev), 'true')
  assert.deepEqual(
    uriPart(operands)(options)(new Date('2020-08-12T13:15:43Z'), stateRev),
    '2020-08-12T13%3A15%3A43.000Z',
  )
})

test('should return undefined for other values', () => {
  assert.deepEqual(uriPart(operands)(options)({}, stateRev), undefined)
  assert.deepEqual(uriPart(operands)(options)(null, stateRev), undefined)
  assert.deepEqual(uriPart(operands)(options)(undefined, stateRev), undefined)
})

test('should not be affected by flip going forward', () => {
  const stateFlipped = { ...stateRev, flip: true }
  const value = "*[_type=='table'&&key==$table][0].fields{key,name,type}"
  const expected =
    "*%5B_type%3D%3D'table'%26%26key%3D%3D%24table%5D%5B0%5D.fields%7Bkey%2Cname%2Ctype%7D"

  const ret = uriPart(operands)(options)(value, stateFlipped)

  assert.deepEqual(ret, expected)
})

test('should not be affected by flip in reverse', () => {
  const stateFlipped = { ...state, flip: true }
  const value =
    "*%5B_type%3D%3D'table'%26%26key%3D%3D%24table%5D%5B0%5D.fields%7Bkey%2Cname%2Ctype%7D"
  const expected = "*[_type=='table'&&key==$table][0].fields{key,name,type}"

  const ret = uriPart(operands)(options)(value, stateFlipped)

  assert.deepEqual(ret, expected)
})
