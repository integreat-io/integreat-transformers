import { isDate } from './utils/is.js'
import type { Transformer } from 'integreat'

const transformer: Transformer = () => () =>
  function type(data) {
    if (isDate(data)) {
      return 'date'
    } else if (data === null) {
      return 'null'
    } else {
      return typeof data
    }
  }

export default transformer
