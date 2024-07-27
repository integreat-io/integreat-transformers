import test from 'node:test'
import assert from 'node:assert/strict'

import truncate from './truncate.js'

// Setup

const operands = {}
const options = {}
const context = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}
const text =
  "JavaScript (/ˈdʒɑːvəskrɪpt/),[10] often abbreviated JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.[11] Over 97% of websites use JavaScript on the client side for web page behavior,[12] often incorporating third-party libraries.[13] All major web browsers have a dedicated JavaScript engine to execute the code on users' devices."

// Tests

test('should truncate a long string', () => {
  const length = 50
  const value = text
  const expected = 'JavaScript (/ˈdʒɑːvəskrɪpt/),[10] often abbreviate'

  const ret = truncate({ length })(options)(value, context)

  assert.deepEqual(ret, expected)
})

test('should truncate a long string and append postfix', () => {
  const length = 50
  const postfix = '...'
  const value = text
  const expected = 'JavaScript (/ˈdʒɑːvəskrɪpt/),[10] often abbrevi...'

  const ret = truncate({ length, postfix })(options)(value, context)

  assert.deepEqual(ret, expected)
})

test('should not truncate a text that is only too long with postfix', () => {
  const length = 10
  const postfix = '...'
  const value = 'JavaScript'
  const expected = 'JavaScript'

  const ret = truncate({ length, postfix })(options)(value, context)

  assert.deepEqual(ret, expected)
})

test('should skip postfix when shortened text would only include postfix', () => {
  const length = 3
  const postfix = '...'
  const value = 'JavaScript'
  const expected = 'Jav'

  const ret = truncate({ length, postfix })(options)(value, context)

  assert.deepEqual(ret, expected)
})

test('should truncate to empty string', () => {
  const length = 0
  const postfix = '...'
  const value = text
  const expected = ''

  const ret = truncate({ length, postfix })(options)(value, context)

  assert.deepEqual(ret, expected)
})

test('should not touch string when no length is set', () => {
  const value = text
  const expected = text

  const ret = truncate(operands)(options)(value, context)

  assert.deepEqual(ret, expected)
})

test('should return undefined when not a string', () => {
  assert.deepEqual(truncate(operands)(options)(14, context), undefined)
  assert.deepEqual(truncate(operands)(options)(true, context), undefined)
  assert.deepEqual(truncate(operands)(options)(new Date(), context), undefined)
  assert.deepEqual(truncate(operands)(options)(null, context), undefined)
  assert.deepEqual(truncate(operands)(options)(undefined, context), undefined)
})

test('should truncate an array of strings', () => {
  const length = 50
  const value = [text, 'Shorty']
  const expected = [
    'JavaScript (/ˈdʒɑːvəskrɪpt/),[10] often abbreviate',
    'Shorty',
  ]

  const ret = truncate({ length })(options)(value, context)

  assert.deepEqual(ret, expected)
})
