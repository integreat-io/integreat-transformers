import mapAny = require('map-any')
import { Transformer } from 'integreat'
import { mapTransform } from 'map-transform'

export interface Operands extends Record<string, unknown> {
  operator?: string
  path?: string
  value?: unknown
  valuePath?: string
  rev?: boolean
  flip?: boolean
}

type MathOp = (a: number, b: number, flip?: boolean) => number

const isFwd = (rev: boolean, flipRev: boolean) => (flipRev ? rev : !rev)

export const parseNum = (value: unknown) =>
  typeof value === 'string' ? Number.parseFloat(value) : value

const add: MathOp = (a, b) => a + b
const subtract: MathOp = (a, b, flip) => (flip ? b - a : a - b)
const multiply: MathOp = (a, b) => a * b
const divide: MathOp = (a, b, flip) => (flip ? b / a : a / b)

function prepareMath({
  operator,
  path = '.',
  value: opValue,
  valuePath: opPath,
  rev: flipRev = false,
  flip = false,
}: Operands) {
  if (typeof opValue !== 'number' && typeof opPath !== 'string') {
    return () => (value: unknown) =>
      typeof value === 'number' ? value : undefined
  }

  const valueGetter = mapTransform(path)
  const opValueGetter =
    typeof opPath === 'string' ? mapTransform(opPath) : () => opValue

  return (rev: boolean) =>
    function doTheMath(data: unknown) {
      const value = parseNum(valueGetter(data))
      const opValue = parseNum(opValueGetter(data))

      if (
        typeof value !== 'number' ||
        Number.isNaN(value) ||
        typeof opValue !== 'number' ||
        Number.isNaN(opValue)
      ) {
        return undefined
      }

      const fwd = isFwd(rev, flipRev)

      switch (operator) {
        case 'add':
          return fwd ? add(value, opValue) : subtract(value, opValue, flip)
        case 'subtract':
          return fwd ? subtract(value, opValue, flip) : add(value, opValue)
        case 'multiply':
          return fwd ? multiply(value, opValue) : divide(value, opValue, flip)
        case 'divide':
          return fwd ? divide(value, opValue, flip) : multiply(value, opValue)
        default:
          return value
      }
    }
}

const transformer: Transformer = function mathTransformer(operands: Operands) {
  const doTheMath = prepareMath(operands)
  return (value, { rev = false }) => mapAny(doTheMath(rev))(value)
}
export default transformer
