import { getPathOrData } from './utils/getters.js'
import type { Transformer } from 'integreat'

export interface Props extends Record<string, unknown> {
  path?: string
  pattern?: string
  caseinsensitive?: boolean
}

const transformer: Transformer = ({
  path,
  pattern,
  caseinsensitive = false,
}: Props) => {
  if (typeof pattern !== 'string') {
    return () => () => false
  }

  const flags = caseinsensitive ? 'i' : ''
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regex = new RegExp(pattern, flags)
  const valueGetter = getPathOrData(path)

  return () =>
    function matchPattern(data) {
      const value = valueGetter(data)
      return typeof value === 'string' && regex.test(value)
    }
}

export default transformer
