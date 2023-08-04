import ajv from 'ajv'
import { getPathOrData } from './utils/getters.js'
import { isObject } from './utils/is.js'
import type { AsyncTransformer } from 'integreat'

const Ajv = ajv.default

const validator = new Ajv()

interface Props extends Record<string, unknown> {
  path?: string
  schema?: Record<string, unknown> | boolean
}

const transformer: AsyncTransformer = function validate({
  path,
  schema,
}: Props) {
  if (schema === true || !isObject(schema)) {
    return () => async () => true
  }
  const getFn = getPathOrData(path)
  const validate = validator.compile(schema)

  return () => async (data) => validate(await getFn(data)) as boolean
}

export default transformer
