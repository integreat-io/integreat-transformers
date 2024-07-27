import test from 'node:test'
import assert from 'node:assert/strict'
import { DateTime } from 'luxon'

import date, { formatDate } from './date.js'

// Setup

const props = {}
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

const theDate = new Date('2019-05-22T13:43:11.345Z')

// Tests -- forward

test('should transform values to date', async () => {
  assert.deepEqual(
    await date(props)(options)(new Date('2019-05-22T13:43:11.345Z'), state),
    theDate,
  )
  assert.deepEqual(
    await date(props)(options)('2019-05-22T15:43:11.345+02:00', state),
    theDate,
  )
  assert.deepEqual(await date(props)(options)(1558532591345, state), theDate)
})

test('should set local dates according to the given time zone', async () => {
  const value = '2019-05-22T13:43:11'
  const tz = 'America/Los_Angeles' // Note this test will always succeed on a computer in this timezone
  const expected = new Date('2019-05-22T20:43:11Z')

  const ret = await date({ tz })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should parse date from a given format', async () => {
  const value = '22.05.2019 kl 18:11'
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = new Date('2019-05-22T16:11:00Z')

  const ret = await date({ format, tz })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined for invalid format', async () => {
  const value = '22.05.2019 kl 18:11'
  const format = 'What is this format?'
  const expected = undefined

  const ret = await date({ format })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should treat number as seconds since poc when isSeconds is true', async () => {
  const isSeconds = true
  const value = 1558532591
  const expected = new Date('2019-05-22T13:43:11Z')

  const ret = await date({ isSeconds })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should not touch null and undefined', async () => {
  assert.deepEqual(await date(props)(options)(null, state), null)
  assert.deepEqual(await date(props)(options)(undefined, state), undefined)
})

test('should transform illegal values to undefined', async () => {
  assert.deepEqual(await date(props)(options)('Not a date', state), undefined)
  assert.deepEqual(await date(props)(options)({}, state), undefined)
  assert.deepEqual(
    await date(props)(options)({ id: '12345', title: 'Wrong' }, state),
    undefined,
  )
  assert.deepEqual(
    await date(props)(options)(new Date('Not a date'), state),
    undefined,
  )
  assert.deepEqual(await date(props)(options)(NaN, state), undefined)
  assert.deepEqual(await date(props)(options)(true, state), undefined)
  assert.deepEqual(await date(props)(options)(false, state), undefined)
})

test('should iterate arrays', async () => {
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

  const ret = await date(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should add a time period', async () => {
  const value = '2022-11-05T13:43:11'
  const period = { day: 1, minute: 3, second: 5 }
  const tz = 'America/Nassau'
  const expected = new Date('2022-11-06T18:46:16Z')

  const ret = await date({ tz, add: period })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should subtract a time period', async () => {
  const value = '2022-11-07T14:43:11'
  const period = { week: 2 }
  const tz = 'America/Nassau'
  const expected = new Date('2022-10-24T18:43:11Z')

  const ret = await date({ tz, subtract: period })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should set a part of the date/time', async () => {
  const value = '2022-12-07T14:43:11.153'
  const period = { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }
  const tz = 'Europe/Oslo'
  const expected = new Date('2022-12-01T00:00:00.000+01:00')

  const ret = await date({ tz, set: period })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should set a part of the date/time in UTC', async () => {
  const value = '2022-12-07T14:43:11.153'
  const period = { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }
  const tz = 'utc'
  const expected = new Date('2022-12-01T00:00:00.000+00:00')

  const ret = await date({ tz, set: period })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should set date/time to UTC with millieseconds', async () => {
  const value = 1558483205213
  const period = { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }
  const tz = 'utc'
  const expected = new Date('2019-05-01T00:00:00Z')

  const ret = await date({ set: period, tz })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should set date/time to UTC with seconds', async () => {
  const value = 1558483201
  const period = { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }
  const tz = 'utc'
  const isSeconds = true
  const expected = new Date('2019-05-01T00:00:00Z')

  const ret = await date({ set: period, tz, isSeconds })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should set date/time to the first of month in UTC time', async () => {
  const value = new Date('2022-12-18 18:43:11')
  const period = { day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }
  const tz = 'utc'
  const expected = new Date('2022-12-01T00:00:00.000+00:00')

  const ret = await date({ set: period, tz })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should parse date on a path', async () => {
  const value = { the_time: '22.05.2019 kl 18:11' }
  const path = 'the_time'
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = new Date('2019-05-22T16:11:00Z')

  const ret = await date({ path, format, tz })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should add a time period from a path to a date from a path', async () => {
  const value = { date: '2022-11-05T13:43:11', numberOfDays: 3 }
  const period = { day: 'numberOfDays', second: 5 }
  const path = 'date'
  const tz = 'America/Nassau'
  const expected = new Date('2022-11-08T18:43:16Z')

  const ret = await date({ tz, path, add: period })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should transform value to date even with iso format specified', async () => {
  const value = '2019-05-22T15:43:11.345+02:00'
  const format = 'iso'
  const expected = new Date('2019-05-22T13:43:11.345Z')

  const ret = await date({ format })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should transform date to ISO string from service when flipped', async () => {
  const stateFlipped = { ...state, flip: true }
  const value = new Date('2019-05-22T13:43:11.345Z')
  const format = 'iso'
  const expected = DateTime.fromJSDate(value).toISO() // Use local zone

  const ret = await date({ format })(options)(value, stateFlipped)

  assert.deepEqual(ret, expected)
})

// Tests -- reverse

test('should not touch date without format string to rev', async () => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const expected = value

  const ret = await date(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should transform date to ISO string', async () => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const format = 'iso'
  const expected = DateTime.fromJSDate(value).toISO() // Use local zone

  const ret = await date({ format })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should transform date to ISO string with time zone', async () => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const format = 'iso'
  const tz = 'America/New_York'
  const expected = '2019-05-22T09:43:11.345-04:00'

  const ret = await date({ format, tz })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should format date to a given format', async () => {
  const value = new Date('2019-05-22T16:11:00Z')
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = '22.05.2019 kl 18:11'

  const ret = await date({ format, tz })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should return number in seconds when isSeconds is true', async () => {
  const isSeconds = true
  const value = new Date('2019-05-22T13:43:11Z')
  const expected = 1558532591

  const ret = await date({ isSeconds })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should cast date string to Date in reverse', async () => {
  const value = '2019-05-22T13:43:11.345Z'
  const expected = new Date('2019-05-22T15:43:11.345+02:00')

  const ret = await date(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should cast from within Integreat without using format and tz', async () => {
  const value = '2019-05-22T16:11:00Z'
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = '22.05.2019 kl 18:11'

  const ret = await date({ format, tz })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should return undefined when not a date', async () => {
  const value = null
  const expected = undefined

  const ret = await date(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should return undefined when invalid date', async () => {
  const value = new Date('Not a date')
  const expected = undefined

  const ret = await date(props)(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should subtract a time period for add in reverse', async () => {
  const value = new Date('2022-11-07T14:43:11-05:00')
  const period = { week: 2 }
  const format = 'iso'
  const tz = 'America/Nassau'
  const expected = '2022-10-24T14:43:11.000-04:00'

  const ret = await date({ format, tz, add: period })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should add a time period for subtract in reverse', async () => {
  const value = new Date('2022-11-05T13:43:11-06:00')
  const period = { day: 1 }
  const format = 'iso'
  const tz = 'America/Nassau'
  const expected = '2022-11-06T15:43:11.000-05:00'

  const ret = await date({ format, tz, subtract: period })(options)(
    value,
    stateRev,
  )

  assert.deepEqual(ret, expected)
})

test('should set a part of the date/time in reverse', async () => {
  const value = new Date('2022-12-07T14:43:11+01:00')
  const period = { day: 1 }
  const format = 'iso'
  const tz = 'Europe/Oslo'
  const expected = '2022-12-01T14:43:11.000+01:00'

  const ret = await date({ format, tz, set: period })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should transform date to ISO string and set on a path', async () => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const path = 'date'
  const format = 'iso'
  const expected = { date: DateTime.fromJSDate(value).toISO() } // Use local zone

  const ret = await date({ path, format })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse string to a date in reverse when flipped', async () => {
  const value = '22.05.2019 kl 18:11'
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = new Date('2019-05-22T16:11:00Z')
  const stateFlipped = { ...stateRev, flip: true }

  const ret = await date({ format, tz })(options)(value, stateFlipped)

  assert.deepEqual(ret, expected)
})

// Tests -- formatDate

test('should format date as ISO string', async () => {
  const value = new Date('2019-05-22T13:43:11.345Z')
  const expected = DateTime.fromJSDate(value).toISO() // Use local zone

  const ret = await formatDate(props)(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should format date to a given format in the given timezone', async () => {
  const value = new Date('2019-05-22T16:11:00Z')
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = '22.05.2019 kl 18:11'

  const ret = await formatDate({ format, tz })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should use Z as timezone for UTC', async () => {
  const value = new Date('2019-05-22T16:11:00Z')
  const format = 'iso'
  const tz = 'utc'
  const expected = '2019-05-22T16:11:00.000Z'

  const ret = await formatDate({ format, tz })(options)(value, stateRev)

  assert.deepEqual(ret, expected)
})

test('should format milliseconds as day of the week', async () => {
  const value = 1666569600000
  const format = 'E'
  const expected = '1'

  const ret = await formatDate({ format })(options)(value, state)

  assert.deepEqual(ret, expected)
})

test('should add a time period when formatting date', async () => {
  const value = new Date('2022-11-05T13:43:11-06:00')
  const period = { day: 1 }
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'America/Nassau'
  const expected = '06.11.2022 kl 15:43'

  const ret = await formatDate({ tz, add: period, format })(options)(
    value,
    state,
  )

  assert.deepEqual(ret, expected)
})

test('should subtract a time period when formatting date', async () => {
  const value = new Date('2022-11-07T14:43:11-05:00')
  const period = { week: 2 }
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'America/Nassau'
  const expected = '24.10.2022 kl 14:43'

  const ret = await formatDate({ tz, subtract: period, format })(options)(
    value,
    state,
  )

  assert.deepEqual(ret, expected)
})

test('should subtract a time period when formatting date in reverse', async () => {
  const value = new Date('2022-11-07T14:43:11-05:00')
  const period = { week: 2 }
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'America/Nassau'
  const expected = '24.10.2022 kl 14:43'

  const ret = await formatDate({ tz, subtract: period, format })(options)(
    value,
    stateRev,
  )

  assert.deepEqual(ret, expected)
})

test('should set a part of the date/time when formatting date', async () => {
  const value = new Date('2022-12-07T14:43:11+01:00')
  const period = { day: 1 }
  const format = "dd.MM.yyyy' kl 'HH:mm"
  const tz = 'Europe/Oslo'
  const expected = '01.12.2022 kl 14:43'

  const ret = await formatDate({ tz, set: period, format })(options)(
    value,
    state,
  )

  assert.deepEqual(ret, expected)
})

test('should format date to number in seconds when isSeconds is true', async () => {
  const isSeconds = true
  const value = new Date('2019-05-22T13:43:11Z')
  const expected = 1558532591

  const ret = await formatDate({ isSeconds })(options)(value, state)

  assert.deepEqual(ret, expected)
})

// All other tests should be covered by the rev version of `date`
