import { getPathOrDefault } from './utils/getters.js'
import { parseNum } from './utils/cast.js'
import { isNumeric, isNumber } from './utils/is.js'
import type { AsyncTransformer } from 'map-transform/types.js'

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

const transformer: AsyncTransformer = function prepareRange(props: Props) {
  const startGetter = getPathOrDefault(props.startPath, props.start, isNumeric)
  const endGetter = getPathOrDefault(props.endPath, props.end, isNumeric)
  const stepGetter = getPathOrDefault(props.stepPath, props.step, isNumeric)

  return () =>
    async function range(data: unknown): Promise<number[] | undefined> {
      const start = parseNum(await startGetter(data))
      const end = parseNum(await endGetter(data))
      const step = parseNum(await stepGetter(data)) || 1

      if (!isNumber(start) || !isNumber(end) || !isNumber(step)) {
        return undefined
      }

      return [...generateStep(start, end, step, props.includeEnd)]
    }
}
export default transformer
