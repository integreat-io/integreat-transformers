import { castDate } from './date.js'
import { isDate } from './utils/is.js'
import type { Transformer } from 'integreat'

const transformer: Transformer = () => () =>
  function ms(value: unknown): number | Date | null | undefined {
    const date = castDate()(value)
    return isDate(date) ? date?.getTime() : undefined
  }

export default transformer
