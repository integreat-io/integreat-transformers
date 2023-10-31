import test from 'ava'

import template from './template.js'

// Setup

const state = {
  rev: false,
  onlyMapped: false,
  context: [],
  value: {},
}

const stateRev = {
  rev: true,
  onlyMapped: false,
  context: [],
  value: {},
}

const options = {}

// Tests -- forward

test('should apply template', async (t) => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should apply template several times', async (t) => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data0 = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const data1 = {
    description: 'Mona Lisa',
    artist: 'Leonardo d.',
  }
  const expected0 = 'Bergen by night. By John F.'
  const expected1 = 'Mona Lisa. By Leonardo d.'

  const ret0 = await template(props)(options)(data0, state)
  const ret1 = await template(props)(options)(data1, state)
  t.is(ret0, expected0)
  t.is(ret1, expected1)
})

test('should apply template from path', async (t) => {
  const props = { templatePath: 'captionTemplate' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
    captionTemplate: '{{description}}. By {{artist}}',
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should apply template from root path', async (t) => {
  const props = { templatePath: '^^setup.captionTemplate' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const stateWithContext = {
    ...state,
    context: [
      { data, setup: { captionTemplate: '{{description}}. By {{artist}}' } },
    ],
    value: data,
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, stateWithContext)

  t.is(ret, expected)
})

test('should apply template from path in flipped reverse', async (t) => {
  const props = { templatePath: 'captionTemplate' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
    captionTemplate: '{{description}}. By {{artist}}',
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, { ...stateRev, flip: true })

  t.is(ret, expected)
})

test('should return undefined when no template at path', async (t) => {
  const props = { templatePath: 'captionTemplate' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = undefined

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should apply template to array', async (t) => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = [
    {
      description: 'Bergen by night',
      artist: 'John F.',
    },
    {
      description: 'Water Lilies',
      artist: 'Monet',
    },
  ]
  const expected = ['Bergen by night. By John F.', 'Water Lilies. By Monet']

  const ret = await template(props)(options)(data, state)

  t.deepEqual(ret, expected)
})

test('should leave missing fields empty', async (t) => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
  }
  const expected = 'Bergen by night. By '

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should force values to string', async (t) => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
    artist: { id: 'johnf' },
  }
  const expected = 'Bergen by night. By [object Object]'

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should support dot notation paths', async (t) => {
  const props = { template: '{{description}}. By {{meta.artist}}' }
  const data = {
    description: 'Bergen by night',
    meta: { artist: 'John F.' },
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should support a single dot as path', async (t) => {
  const props = { template: 'The title: {{.}}' }
  const data = 'Bergen by night'
  const expected = 'The title: Bergen by night'

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should apply uri encoded template', async (t) => {
  const props = {
    template: '/production?query={{{query}}}&%24table=%22{{{tableId}}}%22',
  }
  const data = {
    query:
      "*%5B_type%3D%3D'table'%26%26key%3D%3D%24table%5D%5B0%5D.fields%7Bkey%2Cname%2Ctype%7D",
    tableId: 'orders',
  }
  const expected =
    "/production?query=*%5B_type%3D%3D'table'%26%26key%3D%3D%24table%5D%5B0%5D.fields%7Bkey%2Cname%2Ctype%7D&%24table=%22orders%22"

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should use template without placeholders', async (t) => {
  const props = { template: 'A string!' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = 'A string!'

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should return undefined when no template', async (t) => {
  const props = {}
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = undefined

  const ret = await template(props)(options)(data, state)

  t.is(ret, expected)
})

test('should apply template in array', async (t) => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = [
    {
      description: 'Bergen by night',
      artist: 'John F.',
    },
  ]
  const expected = ['Bergen by night. By John F.']

  const ret = await template(props)(options)(data, state)

  t.deepEqual(ret, expected)
})

test('should return undefined when no data', async (t) => {
  const props = { template: '{{description}}. By {{artist}}' }

  t.is(await template(props)(options)(null, state), undefined)
  t.is(await template(props)(options)(undefined, state), undefined)
})

test('should return undefined when no from template on path', async (t) => {
  const props = { templatePath: 'captionTemplate' }

  t.is(await template(props)(options)(null, state), undefined)
  t.is(await template(props)(options)(undefined, state), undefined)
})

// Tests -- reverse

test('should not touch value in reverse, as parsing is not implemented yet', async (t) => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = data

  const ret = await template(props)(options)(data, stateRev)

  t.is(ret, expected)
})

test('should not touch value in reverse with template from path', async (t) => {
  const props = { templatePath: 'captionTemplate' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
    captionTemplate: '{{description}}. By {{artist}}',
  }
  const expected = data

  const ret = await template(props)(options)(data, stateRev)

  t.is(ret, expected)
})
