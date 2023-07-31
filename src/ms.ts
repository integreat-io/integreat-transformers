import { castDate } from './date.js'
import type { Transformer } from 'map-transform/types.js'

const transformer: Transformer = () => () =>
  function ms(value: unknown): number | Date | null | undefined {
    const date = castDate(value)
    return date?.isValid ? date?.toMillis() : undefined
  }

export default transformer
