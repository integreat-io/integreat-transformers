import { Transformer } from 'integreat'
import objectToArr, { Props } from './objectToArr.js'

const transformer: Transformer = function prepareJoin(props: Props, options) {
  const fn = objectToArr(props, options)

  return function (data, state) {
    return fn(data, { ...state, rev: !state.rev })
  }
}

export default transformer
