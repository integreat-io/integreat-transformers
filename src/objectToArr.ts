import { Transformer } from 'integreat'
import mapTransform from 'map-transform'
import { ensureArray } from './utils/array.js'
import { isObject } from './utils/is.js'

export interface Props extends Record<string, unknown> {
  keys?: string[]
}

const transformer: Transformer = function prepareObjectToArr(props: Props) {
  const transformObject = Object.fromEntries(
    ensureArray(props.keys).map((key, index) => [`[${index}]`, key])
  )
  const keyGetters = mapTransform(transformObject)

  return () =>
    function objectToArr(data, { rev: isRev }) {
      if (isRev) {
        return Array.isArray(data) ? keyGetters(data, { rev: true }) : null
      } else {
        return isObject(data) ? keyGetters(data) : []
      }
    }
}

export default transformer
