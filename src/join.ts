import split, { Props } from './split.js'
import type { AsyncTransformer } from 'map-transform/types.js'

const transformer: AsyncTransformer = function prepareJoin(props: Props) {
  return (options) => {
    const fn = split(props)(options)

    return async function (data, state) {
      return fn(data, { ...state, rev: !state.rev })
    }
  }
}

export default transformer
