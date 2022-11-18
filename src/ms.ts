import { Transformer } from 'integreat'
import { castDate } from './date'
import { isDate } from './utils/is'

const transformer: Transformer = () =>
  function ms(value: unknown): number | Date | null | undefined {
    const date = castDate()(value)
    return isDate(date) ? date?.getTime() : undefined
  }

export default transformer
