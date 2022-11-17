import { castDate } from './date'
import { isDate } from './utils/is'

export interface Operands extends Record<string, unknown> {
  always?: boolean
}

export default ({ always = false }: Operands) =>
  function ms(
    value: unknown,
    { rev = false }: { rev?: boolean }
  ): number | Date | null | undefined {
    const date = castDate()(value)

    if (rev || always) {
      return isDate(date) ? date?.getTime() : undefined
    }

    return date || undefined
  }
