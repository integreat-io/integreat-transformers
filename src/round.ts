import type { Transformer } from 'map-transform/types.js'

export interface Props {
  precision?: number | 'floor' | 'ceil'
  roundTowardsInfinity?: boolean
}

type RoundFn = (value: number, factor: number) => number

// Default JS behavior is to round towards +∞, so round with positive and then
// set the sign to get round towards 0
const roundByFactorTowardsZero: RoundFn = (value, factor) =>
  (Math.round(Math.abs(value * factor)) / factor) * Math.sign(value)

// Use default JS rounding towards +∞
const roundByFactorTowardsInf: RoundFn = (value, factor) =>
  Math.round(value * factor) / factor

// Round to the lower integer.
// TODO: Should this be affected by the `roundTowardsInfinity` flag?
const roundByFloor: RoundFn = (value) => Math.floor(value)

// Round to the higher integer
// TODO: Should this be affected by the `roundTowardsInfinity` flag?
const roundByCeil: RoundFn = (value) => Math.ceil(value)

const getNumber = (value: unknown): number | undefined =>
  typeof value === 'number'
    ? value
    : typeof value === 'string'
    ? Number.parseFloat(value)
    : undefined

const transformer: Transformer = function round({
  precision,
  roundTowardsInfinity = false,
}: Props) {
  const roundFn =
    precision === 'floor'
      ? roundByFloor
      : precision === 'ceil'
      ? roundByCeil
      : roundTowardsInfinity
      ? roundByFactorTowardsInf
      : roundByFactorTowardsZero
  const factor = typeof precision === 'number' ? 10 ** precision : 1

  return () =>
    function round(value) {
      const number = getNumber(value)
      return typeof number === 'number' && !Number.isNaN(number)
        ? roundFn(number, factor)
        : undefined
    }
}

export default transformer
