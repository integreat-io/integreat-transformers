import test from 'ava'

import date, { formatDate } from './date'

// Setup

const operands = {}
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

test('should add a time period', (t) => {
  const value = '2022-11-05T13:43:11'
  const period = { day: 1, minute: 3, second: 5 }
  const tz = 'America/Nassau'
  const expected = new Date('2022-11-06T18:46:16Z')

  const ret = date({ tz, add: period }, options)(value, context)

  t.deepEqual(ret, expected)
})

test('should subtract a time period', (t) => {
  const value = '2022-11-07T14:43:11'
  const period = { week: 2 }
  const tz = 'America/Nassau'
  const expected = new Date('2022-10-24T18:43:11Z')

  const ret = date({ tz, subtract: period }, options)(value, context)

  t.deepEqual(ret, expected)
})

test('should set a part of the date/time', (t) => {
  const value = '2022-12-07T14:43:11.153'
  const period = { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }
  const tz = 'Europe/Oslo'
  const expected = new Date('2022-12-01T00:00:00.000+01:00')

  const ret = date({ tz, set: period }, options)(value, context)

  t.deepEqual(ret, expected)
})

test('should parse date on a path', (t) => {
  const value = { the_time: '22.05.2019 kl 18:11' }
  const path = 'the_time'
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = new Date('2019-05-22T16:11:00Z')

  const ret = date({ path, format, tz }, options)(value, context)

  t.deepEqual(ret, expected)
})

test('should add a time period from a path to a date from a path', (t) => {
  const value = { date: '2022-11-05T13:43:11', numberOfDays: 3 }
  const period = { day: 'numberOfDays', second: 5 }
  const path = 'date'
  const tz = 'America/Nassau'
  const expected = new Date('2022-11-08T18:43:16Z')

  const ret = date({ tz, path, add: period }, options)(value, context)

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

test('should cast incoming value to Date', (t) => {
  const value = '2019-05-22T13:43:11.345Z'
  const expected = '2019-05-22T15:43:11.345+02:00'

  const ret = date(operands, options)(value, contextRev)

  t.is(ret, expected)
})

test('should cast from within Integreat without using format and tz', (t) => {
  const value = '2019-05-22T16:11:00Z'
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = '22.05.2019 kl 18:11'

  const ret = date({ format, tz }, options)(value, contextRev)

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

test('should subtract a time period for add in reverse', (t) => {
  const value = new Date('2022-11-07T14:43:11-05:00')
  const period = { week: 2 }
  const tz = 'America/Nassau'
  const expected = '2022-10-24T14:43:11.000-04:00'

  const ret = date({ tz, add: period }, options)(value, contextRev)

  t.is(ret, expected)
})

test('should add a time period for subtract in reverse', (t) => {
  const value = new Date('2022-11-05T13:43:11-06:00')
  const period = { day: 1 }
  const tz = 'America/Nassau'
  const expected = '2022-11-06T14:43:11.000-05:00'

  const ret = date({ tz, subtract: period }, options)(value, contextRev)

  t.is(ret, expected)
})

test('should set a part of the date/time in reverse', (t) => {
  const value = new Date('2022-12-07T14:43:11+01:00')
  const period = { day: 1 }
  const tz = 'Europe/Oslo'
  const expected = '2022-12-01T14:43:11.000+01:00'

  const ret = date({ tz, set: period }, options)(value, contextRev)

  t.deepEqual(ret, expected)
})

test('should transform date to ISO string and set on a path', (t) => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const path = 'date'
  const expected = { date: '2019-05-22T15:43:11.345+02:00' }

  const ret = date({ path }, options)(value, contextRev)

  t.deepEqual(ret, expected)
})

// Tests -- formatDate

test('should format date as ISO string', (t) => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const expected = '2019-05-22T15:43:11.345+02:00'

  const ret = formatDate(operands, options)(value, context)

  t.is(ret, expected)
})

test('should format date to a given format in the given timezone', (t) => {
  const value = new Date('2019-05-22T16:11:00Z')
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = '22.05.2019 kl 18:11'

  const ret = formatDate({ format, tz }, options)(value, contextRev)

  t.deepEqual(ret, expected)
})

test('should format milliseconds as day of the week', (t) => {
  const value = 1666569600000
  const format = 'E'
  const expected = '1'

  const ret = formatDate({ format }, options)(value, context)

  t.is(ret, expected)
})

test('should add a time period when formatting date', (t) => {
  const value = new Date('2022-11-05T13:43:11-06:00')
  const period = { day: 1 }
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'America/Nassau'
  const expected = '06.11.2022 kl 14:43'

  const ret = formatDate({ tz, add: period, format }, options)(value, context)

  t.deepEqual(ret, expected)
})

test('should subtract a time period when formatting date', (t) => {
  const value = new Date('2022-11-07T14:43:11-05:00')
  const period = { week: 2 }
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'America/Nassau'
  const expected = '24.10.2022 kl 14:43'

  const ret = formatDate({ tz, subtract: period, format }, options)(
    value,
    context
  )

  t.deepEqual(ret, expected)
})

test('should subtract a time period when formatting date in reverse', (t) => {
  const value = new Date('2022-11-07T14:43:11-05:00')
  const period = { week: 2 }
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'America/Nassau'
  const expected = '24.10.2022 kl 14:43'

  const ret = formatDate({ tz, subtract: period, format }, options)(
    value,
    contextRev
  )

  t.deepEqual(ret, expected)
})

test('should set a part of the date/time when formatting date', (t) => {
  const value = new Date('2022-12-07T14:43:11+01:00')
  const period = { day: 1 }
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = '01.12.2022 kl 14:43'

  const ret = formatDate({ tz, set: period, format }, options)(value, context)

  t.deepEqual(ret, expected)
})

// All other tests should be covered by the rev version of `date`
