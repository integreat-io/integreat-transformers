import type { Transformer } from 'integreat'
import { parseNum } from './utils/cast.js'
import { isNumber, isString } from './utils/is.js'

const extractAndParseInt = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits ? parseNum(digits) : undefined
}
const transformer: Transformer = () => () => (value) =>
  isString(value)
    ? extractAndParseInt(value)
    : isNumber(value)
      ? value
      : undefined

export default transformer
