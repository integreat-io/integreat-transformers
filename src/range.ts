import { Transformer } from 'integreat'
import { getPathOrDefault } from './utils/getters.js'
import { isNumber } from './utils/is.js'

export interface Props extends Record<string, unknown> {
  start?: unknown
  end?: unknown
  step?: unknown
  startPath?: string
  endPath?: string
  stepPath?: string
  includeEnd?: boolean
}

const generateStep = function* (
  start: number,
  end: number,
  step = 1,
  includeEnd = false
) {
  let current = start
  while (current < end || (includeEnd && current === end)) {
    yield current
    current += step
  }
}

const transformer: Transformer = function prepareRange(props: Props) {
  const startGetter = getPathOrDefault(props.startPath, props.start, isNumber)
  const endGetter = getPathOrDefault(props.endPath, props.end, isNumber)
  const stepGetter = getPathOrDefault(props.stepPath, props.step, isNumber)

  return function range(data: unknown): number[] | undefined {
    const start = startGetter(data)
    const end = endGetter(data)
    const step = stepGetter(data) || 1

    if (!isNumber(start) || !isNumber(end) || !isNumber(step)) {
      return undefined
    }

    return [...generateStep(start, end, step, props.includeEnd)]
  }
}
export default transformer
