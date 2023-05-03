import mapAny from 'map-any'
import type { Transformer } from 'integreat'

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

    return (data, state) => mapAny(replaceFn(state.rev), data)
  }

export default transformer
