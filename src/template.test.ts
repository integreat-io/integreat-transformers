import test from 'node:test'
import assert from 'node:assert/strict'
import { htmlEncode } from './htmlEntities.js'

import { template, parse } from './template.js'

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

const options = {
  transformers: {
    htmlEncode,
  },
}

// Tests -- template forward

test('should apply template', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should apply template several times', async () => {
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
  assert.deepEqual(ret0, expected0)
  assert.deepEqual(ret1, expected1)
})

test('should apply template from path', async () => {
  const props = { templatePath: 'captionTemplate' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
    captionTemplate: '{{description}}. By {{artist}}',
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should apply template from root path', async () => {
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

  assert.deepEqual(ret, expected)
})

test('should apply template from path in flipped reverse', async () => {
  const props = { templatePath: 'captionTemplate' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
    captionTemplate: '{{description}}. By {{artist}}',
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, { ...stateRev, flip: true })

  assert.deepEqual(ret, expected)
})

test('should return undefined when no template at path', async () => {
  const props = { templatePath: 'captionTemplate' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = undefined

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should apply template to array', async () => {
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

  assert.deepEqual(ret, expected)
})

test('should leave missing fields empty', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
  }
  const expected = 'Bergen by night. By '

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should force values to string', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
    artist: true,
  }
  const expected = 'Bergen by night. By true'

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should leave param empty if the value cannot be forced to string', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
    artist: { id: 'johnf' },
  }
  const expected = 'Bergen by night. By '

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should support dot notation paths', async () => {
  const props = { template: '{{description}}. By {{meta.artist}}' }
  const data = {
    description: 'Bergen by night',
    meta: { artist: 'John F.' },
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should support a single dot as path', async () => {
  const props = { template: 'The title: {{.}}' }
  const data = 'Bergen by night'
  const expected = 'The title: Bergen by night'

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should html encode template values', async () => {
  const props = {
    template: 'The name is {{name}}',
  }
  const data = {
    name: "d'Angelo",
  }
  const expected = 'The name is d&apos;Angelo'

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should not html encode template values when triple brackets', async () => {
  const props = {
    template: 'The name is {{{name}}}',
  }
  const data = {
    name: "d'Angelo",
  }
  const expected = "The name is d'Angelo"

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should apply uri encoded template', async () => {
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

  assert.deepEqual(ret, expected)
})

test('should use template without placeholders', async () => {
  const props = { template: 'A string!' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = 'A string!'

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined when no template', async () => {
  const props = {}
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = undefined

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should apply template with no data', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const expected = '. By '

  assert.deepEqual(await template(props)(options)(null, state), expected)
  assert.deepEqual(await template(props)(options)(undefined, state), expected)
})

test('should return undefined when no from template on path', async () => {
  const props = { templatePath: 'captionTemplate' }

  assert.deepEqual(await template(props)(options)(null, state), undefined)
  assert.deepEqual(await template(props)(options)(undefined, state), undefined)
})

// Tests -- parse forward

test('parse should parse going forward', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = 'Bergen by night. By John F.'
  const expected = {
    description: 'Bergen by night',
    artist: 'John F.',
  }

  const ret = await parse(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('parse should html decode template values going forward', async () => {
  const props = {
    template: 'The name is {{name}}',
  }
  const data = 'The name is d&apos;Angelo'
  const expected = {
    name: "d'Angelo",
  }

  const ret = await parse(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

// Tests -- template reverse

test('should parse in reverse', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = 'Bergen by night. By John F.'
  const expected = {
    description: 'Bergen by night',
    artist: 'John F.',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse when template ends with a string', async () => {
  const props = { template: '{{description}}. By {{artist}}!' }
  const data = 'Bergen by night. By John F.!'
  const expected = {
    description: 'Bergen by night',
    artist: 'John F.',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse when template starts with a string', async () => {
  const props = { template: "The painting '{{description}}' by {{artist}}" }
  const data = "The painting 'Bergen by night' by John F."
  const expected = {
    description: 'Bergen by night',
    artist: 'John F.',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse when template is just a param', async () => {
  const props = { template: '{{description}}' }
  const data = 'Bergen by night'
  const expected = {
    description: 'Bergen by night',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse when string does not match the full template', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = 'Bergen by night'
  const expected = {
    description: 'Bergen by night',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse when the last param was an empty string', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = 'Bergen by night. By '
  const expected = {
    description: 'Bergen by night',
    artist: '',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse when a param in the middle was an empty string', async () => {
  const props = { template: "The painting '{{description}}' by {{artist}}" }
  const data = "The painting '' by John F."
  const expected = {
    description: '',
    artist: 'John F.',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse and html decode template values', async () => {
  const props = {
    template: 'The name is {{name}}',
  }
  const data = 'The name is d&apos;Angelo'
  const expected = {
    name: "d'Angelo",
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse and not html decode for triple brackets', async () => {
  const props = {
    template: 'The name is {{{name}}}',
  }
  const data = 'The name is d&apos;Angelo'
  const expected = {
    name: 'd&apos;Angelo',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

// Note: This is the best we can do here. Maybe we can improve this later with
// param hints, but some cases may always be a lost cause.
test('should parse in reverse when it is not possible to match correctly', async () => {
  const props = { template: 'The painting {{description}} by {{artist}}' }
  const data = 'The painting Bergen by night by John F.'
  const expected = {
    description: 'Bergen',
    artist: 'night by John F.',
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse from array', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = ['Bergen by night. By John F.', 'Water Lilies. By Monet']
  const expected = [
    {
      description: 'Bergen by night',
      artist: 'John F.',
    },
    {
      description: 'Water Lilies',
      artist: 'Monet',
    },
  ]

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse with dot notation paths', async () => {
  const props = { template: '{{description}}. By {{meta.artist}}' }
  const data = 'Bergen by night. By John F.'
  const expected = {
    description: 'Bergen by night',
    meta: { artist: 'John F.' },
  }

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should support a single dot as path', async () => {
  const props = { template: 'The title: {{.}}' }
  const data = 'Bergen by night'
  const expected = 'The title: Bergen by night'

  const ret = await template(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should parse in reverse when data is not a string', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = null
  const expected = undefined

  const ret = await template(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should parse with template from path in reverse', async () => {
  const props = { templatePath: '^^setup.captionTemplate' }
  const data = 'Bergen by night. By John F.'
  const stateRevWithContext = {
    ...stateRev,
    context: [
      { data, setup: { captionTemplate: '{{description}}. By {{artist}}' } },
    ],
    value: data,
  }
  const expected = {
    description: 'Bergen by night',
    artist: 'John F.',
  }

  const ret = await template(props)(options)(data, stateRevWithContext)

  assert.deepEqual(ret, expected)
})

// Tests -- parse reverse

test('parse should apply template in reverse', async () => {
  const props = { template: '{{description}}. By {{artist}}' }
  const data = {
    description: 'Bergen by night',
    artist: 'John F.',
  }
  const expected = 'Bergen by night. By John F.'

  const ret = await parse(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('parse should html encode template values in reverse', async () => {
  const props = {
    template: 'The name is {{name}}',
  }
  const data = {
    name: "d'Angelo",
  }
  const expected = 'The name is d&apos;Angelo'

  const ret = await parse(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})
