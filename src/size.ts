import { Transformer } from 'integreat'
import { isString, isArray, isNumber } from './utils/is.js'

const transformer: Transformer = function prepareSize() {
  return () =>
    function size(data) {
      return isNumber(data)
        ? String(data).length
        : isString(data) || isArray(data)
        ? data.length
        : data === null || data === undefined
        ? 0
        : 1
    }
}

export default transformer
