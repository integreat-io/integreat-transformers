import test from 'ava'

import date from './date'

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
const contextRev = {
  rev: true,
  onlyMappedValues: false,
  root: {},
  context: {},
  value: {},
}

const theDate = new Date('2019-05-22T13:43:11.345Z')

// Tests -- forward

test('should transform values to date', (t) => {
  t.deepEqual(
    date(operands, options)(new Date('2019-05-22T13:43:11.345Z'), context),
    theDate
  )
  t.deepEqual(
    date(operands, options)('2019-05-22T15:43:11.345+02:00', context),
    theDate
  )
  t.deepEqual(date(operands, options)(1558532591345, context), theDate)
})

test('should set local dates according to the given time zone', (t) => {
  const value = '2019-05-22T13:43:11'
  const tz = 'America/Los_Angeles' // Note this test will always succeed on a computer in this timezone
  const expected = new Date('2019-05-22T20:43:11Z')

  const ret = date({ tz }, options)(value, context)

  t.deepEqual(ret, expected)
})

test('should parse date from a given format', (t) => {
  const value = '22.05.2019 kl 18:11'
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = new Date('2019-05-22T16:11:00Z')

  const ret = date({ format, tz }, options)(value, context)

  t.deepEqual(ret, expected)
})

test('should return undefined for invalid format', (t) => {
  const value = '22.05.2019 kl 18:11'
  const format = 'What is this format?'
  const expected = undefined

  const ret = date({ format }, options)(value, context)

  t.is(ret, expected)
})

test('should treat number as seconds since poc when isSeconds is true', (t) => {
  const isSeconds = true
  const value = 1558532591
  const expected = new Date('2019-05-22T13:43:11Z')

  const ret = date({ isSeconds }, options)(value, context)

  t.deepEqual(ret, expected)
})

test('should not touch null and undefined', (t) => {
  t.is(date(operands, options)(null, context), null)
  t.is(date(operands, options)(undefined, context), undefined)
})

test('should transform illegal values to undefined', (t) => {
  t.is(date(operands, options)('Not a date', context), undefined)
  t.is(date(operands, options)({}, context), undefined)
  t.is(
    date(operands, options)({ id: '12345', title: 'Wrong' }, context),
    undefined
  )
  t.is(date(operands, options)(new Date('Not a date'), context), undefined)
  t.is(date(operands, options)(NaN, context), undefined)
  t.is(date(operands, options)(true, context), undefined)
  t.is(date(operands, options)(false, context), undefined)
})

test('should iterate arrays', (t) => {
  const value = [
    new Date('2019-05-22T13:43:11.345Z'),
    '2019-05-22T15:43:11.345+02:00',
    1558532591345,
    null,
    'A string',
    undefined,
    true,
    {},
  ]
  const expected = [
    theDate,
    theDate,
    theDate,
    null,
    undefined,
    undefined,
    undefined,
    undefined,
  ]

  const ret = date(operands, options)(value, context)

  t.deepEqual(ret, expected)
})

// Tests -- reverse

test('should transform date to ISO string', (t) => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const expected = '2019-05-22T15:43:11.345+02:00'

  const ret = date(operands, options)(value, contextRev)

  t.is(ret, expected)
})

test('should transform date to ISO string with time zone', (t) => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const tz = 'America/New_York'
  const expected = '2019-05-22T09:43:11.345-04:00'

  const ret = date({ tz }, options)(value, contextRev)

  t.is(ret, expected)
})

test('should format date to a given format', (t) => {
  const value = new Date('2019-05-22T16:11:00Z')
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = '22.05.2019 kl 18:11'

  const ret = date({ format, tz }, options)(value, contextRev)

  t.deepEqual(ret, expected)
})

test('should return number in seconds when isSeconds is true', (t) => {
  const isSeconds = true
  const value = new Date('2019-05-22T13:43:11Z')
  const expected = 1558532591

  const ret = date({ isSeconds }, options)(value, contextRev)

  t.deepEqual(ret, expected)
})

test('should return undefined when not a date', (t) => {
  const value = null
  const expected = undefined

  const ret = date(operands, options)(value, contextRev)

  t.deepEqual(ret, expected)
})

test('should return undefined when invalid date', (t) => {
  const value = new Date('Not a date')
  const expected = undefined

  const ret = date(operands, options)(value, contextRev)

  t.deepEqual(ret, expected)
})
