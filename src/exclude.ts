import { getPathOrDefault } from './utils/getters.js'
import type { AsyncTransformer } from 'map-transform/types.js'

export interface Props extends Record<string, unknown> {
  path?: string
  excludePath?: string
}

const ensureArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value]

const transformer: AsyncTransformer = function exclude({
  path,
  excludePath,
}: Props) {
  const getArrFn = getPathOrDefault(path)
  const getExcludeFn = getPathOrDefault(excludePath)

  return () => async (data: unknown) => {
    const arr = ensureArray(await getArrFn(data))
    const exclude = ensureArray(await getExcludeFn(data))
    return arr.filter((value) => !exclude.includes(value))
  }
}

export default transformer
