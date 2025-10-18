import { parseNum } from './utils/cast.js'
import type { Transformer } from 'map-transform/types.js'

function add(sum: number, value: unknown) {
  const num = parseNum(value)
  return typeof num === 'number' && !Number.isNaN(num) ? sum + num : sum
}

const transformer: Transformer = () => () => (data) =>
  Array.isArray(data)
    ? data.reduce((sum, value) => add(sum, value), 0)
    : add(0, data)

export default transformer
