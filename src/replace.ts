import mapAny from 'map-any'
import xor from './utils/xor.js'
import type { Transformer } from 'map-transform/types.js'

interface Props extends Record<string, unknown> {
  from?: string
  to?: string
}

const replace =
  (from: string, to: string) =>
  (rev = false) =>
    function replace(data: unknown) {
      if (typeof data !== 'string') {
        return data
      }

      return rev ? data.replaceAll(to, from) : data.replaceAll(from, to)
    }

const transformer: Transformer =
  ({ from, to }: Props) =>
  () => {
    if (typeof to !== 'string' || typeof from !== 'string') {
      return (value) => value
    }

    const replaceFn = replace(from, to)

    return (data, state) => {
      const isRev = xor(state.rev, state.flip)
      return mapAny(replaceFn(isRev))(data)
    }
  }

export default transformer
