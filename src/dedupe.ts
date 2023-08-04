import type { AsyncTransformer } from 'integreat'
import { isArray } from './utils/is.js'
import { getPathOrDefault } from './utils/getters.js'

export interface Props extends Record<string, unknown> {
  path?: string
}

const transformer: AsyncTransformer = function removeDuplicates({
  path = '.',
}: Props) {
  const getter = getPathOrDefault(path)
  return () => async (data: unknown) => {
    if (!isArray(data) || data.length < 2) {
      return data // Nothing to dedupe
    }

    // Loop through all elements in the array and add them to `deduped` if the
    // value from the element on the given `path` is not already found on
    // another element on the same path. Also remove `undefined` values.
    // As the getter is async, we first fetch all values and then compare them.
    const arr: [unknown, unknown][] = []
    for (const element of data) {
      const value = await getter(element)
      arr.push([value, element])
    }
    return arr
      .filter(([value], index) => {
        return value === undefined
          ? false // Drop `undefined` values
          : arr.findIndex(([comp]) => comp === value) === index // Check if this is the first time the `value` is seen in the array
      })
      .map(([, element]) => element) // Extract the elements that survived deduping
  }
}

export default transformer
