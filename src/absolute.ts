import type { Transformer } from 'integreat'
import { isNumber } from './utils/is.js'

const transformer: Transformer = () => () => (value) =>
  isNumber(value) ? Math.abs(value as number) : undefined

export default transformer
