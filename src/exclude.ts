import { getPathOrDefault } from './utils/getters.js'
import type { Transformer } from 'integreat'

export interface Props extends Record<string, unknown> {
  path?: string
  excludePath?: string
}

const ensureArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value]

const transformer: Transformer = function exclude({
  path,
  excludePath,
}: Props) {
  const getArrFn = getPathOrDefault(path)
  const getExcludeFn = getPathOrDefault(excludePath)

  return () => (data: unknown) => {
    const arr = ensureArray(getArrFn(data))
    const exclude = ensureArray(getExcludeFn(data))
    return arr.filter((value) => !exclude.includes(value))
  }
}

export default transformer
