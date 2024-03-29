import mapTransform from 'map-transform'
import { ensureArray } from './utils/array.js'
import { isObject } from './utils/is.js'
import xor from './utils/xor.js'
import type { AsyncTransformer } from 'integreat'

export interface Props extends Record<string, unknown> {
  keys?: string[]
}

const transformer: AsyncTransformer = function prepareObjectToArr(
  props: Props
) {
  const transformObject = Object.fromEntries(
    ensureArray(props.keys).map((key, index) => [`[${index}]`, key])
  )
  const keyGetters = mapTransform(transformObject)

  return () =>
    async function objectToArr(data, { rev = false, flip = false }) {
      const isRev = xor(rev, flip)
      if (isRev) {
        return Array.isArray(data)
          ? await keyGetters(data, { rev: true })
          : null
      } else {
        return isObject(data) ? await keyGetters(data) : []
      }
    }
}

export default transformer
