import { Transformer } from 'integreat'
import { castDate } from './date.js'
import { isDate } from './utils/is.js'

const transformer: Transformer = () => () =>
  function ms(value: unknown): number | Date | null | undefined {
    const date = castDate()(value)
    return isDate(date) ? date?.getTime() : undefined
  }

export default transformer
