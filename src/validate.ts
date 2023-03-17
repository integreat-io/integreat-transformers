import ajv from 'ajv'
import type { Transformer } from 'integreat'
import { getPathOrData } from './utils/getters.js'
import { isObject } from './utils/is.js'

const Ajv = ajv.default

const validator = new Ajv()

interface Props extends Record<string, unknown> {
  path?: string
  schema?: Record<string, unknown> | boolean
}

const transformer: Transformer = function validate({ path, schema }: Props) {
  if (schema === true || !isObject(schema)) {
    return () => () => true
  }
  const getFn = getPathOrData(path)
  const validate = validator.compile(schema)

  return () => (data) => validate(getFn(data)) as boolean
}

export default transformer
