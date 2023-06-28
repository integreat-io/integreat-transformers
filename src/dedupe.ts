import type { Transformer } from 'integreat'
import { isArray } from './utils/is.js'
import { getPathOrDefault } from './utils/getters.js'

export interface Props extends Record<string, unknown> {
  path?: string
}

const transformer: Transformer = function removeDuplicates({
  path = '.',
}: Props) {
  const getter = getPathOrDefault(path)
  return () => (data: unknown) => {
    return !isArray(data)
      ? data
      : data.filter((element, index) => {
          const value = getter(element)
          return value === undefined
            ? false
            : data.findIndex((item) => getter(item) === value) === index
        })
  }
}

export default transformer
