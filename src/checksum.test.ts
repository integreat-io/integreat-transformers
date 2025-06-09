import test from 'node:test'
import assert from 'node:assert/strict'

import checksum from './checksum.js'

// Setup

const props = {}
const options = {}
const context = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests

test('should return checksum for object', () => {
  const data = { id: 'ent1', $type: 'entry', title: 'Entry 1' }
  const expected =
    '6d39df39a3a9217673352d764739e7d80be478b81ecf5286c59342a66970dde8'

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should return checksum for object with includeKeys', () => {
  const data = { id: 'ent1', $type: 'entry', title: 'Entry 1' }
  const props = { includeKeys: ['id', 'title'] }
  const expected =
    '43f8209ed27ca3a885c0bf1a31dde31f6d2cfeff44f5224ef77d10c18d9e3c75'

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should return checksum for nested objects with includeKeys', () => {
  const data = {
    id: 'ent1',
    $type: 'entry',
    title: 'Entry 1',
    author: { id: 'user1', name: 'User 1' },
  }
  const props = { includeKeys: ['id', 'title', 'author.id'] }
  const expected =
    '7a966577988b17f9320aec9fc8f1722f29b5b4e5ebabc37b643b29c913caa670'

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should return checksum for string', () => {
  const data = 'A string that will be hashed'
  const expected =
    '2002a4c8c6a6957f6c4a7a1a0bb119c6ff9a3b1d59de52542ce2265818a33349'

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should return checksum for empty string', () => {
  const data = ''
  const expected =
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should return checksum for a number', () => {
  const data = 52
  const expected =
    '41cfc0d1f2d127b04555b7246d84019b4d27710a3f3aff6e7764375b1e06e05d'

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should return checksum for boolean', () => {
  const data = true
  const expected =
    'b5bea41b6c623f7c09f1bf24dcae58ebab3c0cdd90ad966bc43a45b44867e12b'

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should return checksum for date', () => {
  const data = new Date('2025-04-18T00:14:44Z')
  const expected =
    '59405a4003db5189b17f64b70f516cdb9b39984cd5cac5096d9725329b311d74'

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should return checksum for an array', () => {
  const data = [
    { id: 'ent1', $type: 'entry', title: 'Entry 1' },
    null,
    450,
    { id: 'ent2', $type: 'entry', title: 'Entry 2' },
    false,
  ]
  const expected = [
    '6d39df39a3a9217673352d764739e7d80be478b81ecf5286c59342a66970dde8',
    null,
    '83151157c10d85af7c84657c71c3e3603d955160f0526fce672481da83a2e090',
    '7d8f8fec568cfb1898e497c4311ce9f6fcf1fe38e9d71afd6a0db7132fc29a8e',
    'fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa',
  ]

  const ret = checksum(props)(options)(data, context)

  assert.deepEqual(ret, expected)
})

test('should not hash null', () => {
  const data = null
  const expected = null

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})

test('should not hash undefined', () => {
  const data = undefined
  const expected = undefined

  const ret = checksum(props)(options)(data, context)

  assert.equal(ret, expected)
})
