import test from 'ava'

import truncate from './truncate'

// Setup

const operands = {}
const options = {}
const context = {
  rev: false,
  onlyMappedValues: false,
  root: {},
  context: {},
  value: {},
}
const text =
  "JavaScript (/ˈdʒɑːvəskrɪpt/),[10] often abbreviated JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.[11] Over 97% of websites use JavaScript on the client side for web page behavior,[12] often incorporating third-party libraries.[13] All major web browsers have a dedicated JavaScript engine to execute the code on users' devices."

// Tests

test('should truncate a long string', (t) => {
  const length = 50
  const value = text
  const expected = 'JavaScript (/ˈdʒɑːvəskrɪpt/),[10] often abbreviate'

  const ret = truncate({ length }, options)(value, context)

  t.is(ret, expected)
})

test('should truncate a long string and append postfix', (t) => {
  const length = 50
  const postfix = '...'
  const value = text
  const expected = 'JavaScript (/ˈdʒɑːvəskrɪpt/),[10] often abbrevi...'

  const ret = truncate({ length, postfix }, options)(value, context)

  t.is(ret, expected)
})

test('should not truncate a text that is only too long with postfix', (t) => {
  const length = 10
  const postfix = '...'
  const value = 'JavaScript'
  const expected = 'JavaScript'

  const ret = truncate({ length, postfix }, options)(value, context)

  t.is(ret, expected)
})

test('should skip postfix when shortened text would only include postfix', (t) => {
  const length = 3
  const postfix = '...'
  const value = 'JavaScript'
  const expected = 'Jav'

  const ret = truncate({ length, postfix }, options)(value, context)

  t.is(ret, expected)
})

test('should truncate to empty string', (t) => {
  const length = 0
  const postfix = '...'
  const value = text
  const expected = ''

  const ret = truncate({ length, postfix }, options)(value, context)

  t.is(ret, expected)
})

test('should not touch string when no length is set', (t) => {
  const value = text
  const expected = text

  const ret = truncate(operands, options)(value, context)

  t.is(ret, expected)
})

test('should return undefined when not a string', (t) => {
  t.is(truncate(operands, options)(14, context), undefined)
  t.is(truncate(operands, options)(true, context), undefined)
  t.is(truncate(operands, options)(new Date(), context), undefined)
  t.is(truncate(operands, options)(null, context), undefined)
  t.is(truncate(operands, options)(undefined, context), undefined)
})

test('should truncate an array of strings', (t) => {
  const length = 50
  const value = [text, 'Shorty']
  const expected = [
    'JavaScript (/ˈdʒɑːvəskrɪpt/),[10] often abbreviate',
    'Shorty',
  ]

  const ret = truncate({ length }, options)(value, context)

  t.deepEqual(ret, expected)
})
