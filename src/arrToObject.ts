import objectToArr, { Props } from './objectToArr.js'
import type { AsyncTransformer } from 'map-transform/types.js'

const transformer: AsyncTransformer = function prepareJoin(props: Props) {
  return (options) => {
    const fn = objectToArr(props)(options)

    return async function (data, state) {
      return await fn(data, { ...state, rev: !state.rev })
    }
  }
}

export default transformer
