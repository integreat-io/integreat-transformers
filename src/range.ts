import { mapTransform } from 'map-transform'
import { Transformer } from 'integreat'

export interface Operands extends Record<string, unknown> {
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

function getFromValueOrPath(data: unknown, path?: string, value?: unknown) {
  if (typeof path === 'string') {
    const valueFromData = mapTransform(path)(data)
    if (typeof valueFromData === 'number') {
      return valueFromData
    }
  }

  if (typeof value === 'number') {
    return value
  }

  return undefined
}
const transformer: Transformer = (operands: Operands) =>
  function range(data: unknown): number[] | undefined {
    const start = getFromValueOrPath(data, operands.startPath, operands.start)
    const end = getFromValueOrPath(data, operands.endPath, operands.end)
    const step = getFromValueOrPath(data, operands.stepPath, operands.step) ?? 1

    if (
      typeof start !== 'number' ||
      typeof end !== 'number' ||
      typeof step !== 'number'
    ) {
      return undefined
    }

    return [...generateStep(start, end, step, operands.includeEnd)]
  }

export default transformer
