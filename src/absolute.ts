import type { Transformer } from 'integreat'
import { parseNum } from './utils/cast.js'
import { isNumber } from './utils/is.js'

const transformer: Transformer = () => () => (value) => {
  const parsedValue = parseNum(value)
  return isNumber(parsedValue) && !Number.isNaN(parsedValue)
    ? Math.abs(parsedValue)
    : undefined
}
export default transformer
