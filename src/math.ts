import mapAny from 'map-any/async.js'
import { getPathOrData, getPathOrDefault } from './utils/getters.js'
import { parseNum } from './utils/cast.js'
import { isNumeric } from './utils/is.js'
import xor from './utils/xor.js'
import type { AsyncTransformer } from 'map-transform/types.js'

export interface Props extends Record<string, unknown> {
  operator?: string
  path?: string
  value?: unknown
  valuePath?: string
  rev?: boolean
  flip?: boolean
}

type MathOp = (a: number, b: number, flip?: boolean) => number

const isFwd = (rev: boolean, flipRev: boolean) => (flipRev ? rev : !rev)

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
}: Props) {
  if (typeof opValue !== 'number' && typeof opPath !== 'string') {
    return () => async (value: unknown) =>
      typeof value === 'number' ? value : undefined
  }

  const valueGetter = getPathOrData(path)
  const opValueGetter = getPathOrDefault(opPath, opValue, isNumeric)

  return (rev: boolean) =>
    async function doTheMath(data: unknown) {
      const value = parseNum(await valueGetter(data))
      const opValue = parseNum(await opValueGetter(data))

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

const transformer: AsyncTransformer = function mathTransformer(props: Props) {
  const doTheMath = prepareMath(props)
  return () => async (value, state) => {
    const isRev = xor(state.rev, state.flip)
    return await mapAny(doTheMath(isRev))(value)
  }
}
export default transformer
