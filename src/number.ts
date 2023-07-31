import mapAny from 'map-any'
import { isDate } from './utils/is.js'
import type { Transformer } from 'map-transform/types.js'

export interface Props extends Record<string, unknown> {
  precision?: number
}

const numberOrUndefined = (value: number) => (isNaN(value) ? undefined : value)

const round = (value?: number, precisionProduct?: number) =>
  typeof value === 'number' && typeof precisionProduct === 'number'
    ? Math.round(value * precisionProduct) / precisionProduct
    : value

export const castNumber = (precision?: number) => {
  const precisionProduct =
    typeof precision === 'number' ? Math.pow(10, precision) : undefined

  return function castNumber(value: unknown) {
    if (typeof value === 'number') {
      return round(numberOrUndefined(value), precisionProduct)
    } else if (value === null || value === undefined) {
      return value
    } else if (typeof value === 'string') {
      return round(
        numberOrUndefined(Number.parseFloat(value)),
        precisionProduct
      )
    } else if (typeof value === 'boolean') {
      return Number(value)
    } else if (isDate(value)) {
      return numberOrUndefined(value.getTime())
    } else {
      return undefined
    }
  }
}

const transformer: Transformer =
  ({ precision }: Props) =>
  () =>
    mapAny(castNumber(precision))

export default transformer
