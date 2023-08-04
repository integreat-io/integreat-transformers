import { getPathOrData } from './utils/getters.js'
import type { AsyncTransformer } from 'integreat'

export interface Props extends Record<string, unknown> {
  path?: string
  pattern?: string
  caseinsensitive?: boolean
}

const transformer: AsyncTransformer = ({
  path,
  pattern,
  caseinsensitive = false,
}: Props) => {
  if (typeof pattern !== 'string') {
    return () => async () => false
  }

  const flags = caseinsensitive ? 'i' : ''
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regex = new RegExp(pattern, flags)
  const valueGetter = getPathOrData(path)

  return () =>
    async function matchPattern(data) {
      const value = await valueGetter(data)
      return typeof value === 'string' && regex.test(value)
    }
}

export default transformer
