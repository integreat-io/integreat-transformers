import { Transformer } from 'integreat'
import split, { Props } from './split.js'

const transformer: Transformer = function prepareJoin(props: Props, options) {
  const fn = split(props, options)

  return function (data, state) {
    return fn(data, { ...state, rev: !state.rev })
  }
}

export default transformer
