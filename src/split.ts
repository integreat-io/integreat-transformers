import { Transformer } from 'integreat'
import { getPathOrData, getPathOrDefault } from './utils/getters.js'
import { isNumber } from './utils/is.js'

export interface Props extends Record<string, unknown> {
  path?: string
  size?: number
  sizePath?: string
}

const splitString = (value: string, size: number) =>
  value.match(new RegExp(`.{1,${size}}`, 'g')) || [] // eslint-disable-line security/detect-non-literal-regexp

const numberToString = (value: unknown) =>
  typeof value === 'number' ? String(value) : value

function splitArray(value: unknown[], size: number) {
  const ret = []
  for (let i = 0; i < value.length; i += size) {
    ret.push(value.slice(i, i + size))
  }
  return ret
}

const hasSubArrays = (arr: unknown[]): arr is unknown[][] =>
  arr.some((value) => Array.isArray(value))

function fwd(value: unknown, size: number) {
  if (typeof value === 'string') {
    return splitString(value, size)
  } else if (Array.isArray(value)) {
    return splitArray(value, size)
  } else {
    return value
  }
}

function rev(value: unknown, _size: number) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return []
    } else if (hasSubArrays(value)) {
      return value.flat()
    } else {
      return value.join('')
    }
  }

  return value
}

const transformer: Transformer = function prepareSplit(props: Props) {
  const valueGetter = getPathOrData(props.path)
  const sizeGetter = getPathOrDefault(props.sizePath, props.size, isNumber)

  return function split(data: unknown, { rev: isRev = false }): unknown {
    const size = sizeGetter(data)
    const value = numberToString(valueGetter(data))

    if (typeof size === 'number') {
      return isRev ? rev(value, size) : fwd(value, size)
    } else {
      return value
    }
  }
}

export default transformer
