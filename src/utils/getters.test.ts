import test from 'ava'

import { getPathOrData, getPathOrDefault } from './getters.js'

// Tests -- getPathOrData

test('should get from path', (t) => {
  const data = { content: { title: 'Entry 1' } }
  const path = 'content.title'
  const expected = 'Entry 1'

  const ret = getPathOrData(path)(data)

  t.is(ret, expected)
})

test('should return data when no path', (t) => {
  const data = { content: { title: 'Entry 1' } }
  const path = undefined
  const expected = data

  const ret = getPathOrData(path)(data)

  t.deepEqual(ret, expected)
})

test('should return undefined when path yields no data', (t) => {
  const data = { content: { title: 'Entry 1' } }
  const path = 'unknown.location'
  const expected = undefined

  const ret = getPathOrData(path)(data)

  t.is(ret, expected)
})

// Tests -- getPathOrDefault

test('should get from path - getPathOrDefault', (t) => {
  const data = { content: { title: 'Entry 1' } }
  const path = 'content.title'
  const expected = 'Entry 1'

  const ret = getPathOrDefault(path, 'Default')(data)

  t.is(ret, expected)
})

test('should return default value when path yields no data', (t) => {
  const data = { content: { title: 'Entry 1' } }
  const path = 'unknown.location'
  const expected = 'Default'

  const ret = getPathOrDefault(path, 'Default')(data)

  t.is(ret, expected)
})

test('should return default value when no path', (t) => {
  const data = { content: { title: 'Entry 1' } }
  const path = undefined
  const expected = 'Default'

  const ret = getPathOrDefault(path, 'Default')(data)

  t.is(ret, expected)
})

test('should test for value with given predicate', (t) => {
  const data = { content: { title: 'Entry 1' }, size: 'Not a number' }
  const path = 'size'
  const predicate = (value: unknown) => typeof value === 'number'
  const expected = 10

  const ret = getPathOrDefault(path, 10, predicate)(data)

  t.is(ret, expected)
})
