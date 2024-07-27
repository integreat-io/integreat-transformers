import test from 'node:test'
import assert from 'node:assert/strict'

import { getPathOrData, getPathOrDefault } from './getters.js'

// Tests -- getPathOrData

test('should get from path', async () => {
  const data = { content: { title: 'Entry 1' } }
  const path = 'content.title'
  const expected = 'Entry 1'

  const ret = await getPathOrData(path)(data)

  assert.deepEqual(ret, expected)
})

test('should return data when no path', async () => {
  const data = { content: { title: 'Entry 1' } }
  const path = undefined
  const expected = data

  const ret = await getPathOrData(path)(data)

  assert.deepEqual(ret, expected)
})

test('should return undefined when path yields no data', async () => {
  const data = { content: { title: 'Entry 1' } }
  const path = 'unknown.location'
  const expected = undefined

  const ret = await getPathOrData(path)(data)

  assert.deepEqual(ret, expected)
})

// Tests -- getPathOrDefault

test('should get from path - getPathOrDefault', async () => {
  const data = { content: { title: 'Entry 1' } }
  const path = 'content.title'
  const expected = 'Entry 1'

  const ret = await getPathOrDefault(path, 'Default')(data)

  assert.deepEqual(ret, expected)
})

test('should return default value when path yields no data', async () => {
  const data = { content: { title: 'Entry 1' } }
  const path = 'unknown.location'
  const expected = 'Default'

  const ret = await getPathOrDefault(path, 'Default')(data)

  assert.deepEqual(ret, expected)
})

test('should return default value when no path', async () => {
  const data = { content: { title: 'Entry 1' } }
  const path = undefined
  const expected = 'Default'

  const ret = await getPathOrDefault(path, 'Default')(data)

  assert.deepEqual(ret, expected)
})

test('should test for value with given predicate', async () => {
  const data = { content: { title: 'Entry 1' }, size: 'Not a number' }
  const path = 'size'
  const predicate = (value: unknown) => typeof value === 'number'
  const expected = 10

  const ret = await getPathOrDefault(path, 10, predicate)(data)

  assert.deepEqual(ret, expected)
})
