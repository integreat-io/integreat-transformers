import { mapTransform } from 'map-transform'
import { Transformer } from 'integreat'

export interface Props extends Record<string, unknown> {
  path?: string
  size?: number
  sizePath?: string
}

const splitString = (value: string, size: number) =>
  value.match(new RegExp(`.{1,${size}}`, 'g')) || [] // eslint-disable-line security/detect-non-literal-regexp

const numberToString = (value: unknown) =>
  typeof value === 'number' ? String(value) : value

const numberOrDefault = (value: unknown, def: unknown) =>
  typeof value === 'number' ? value : def

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
  const valueGetter =
    typeof props.path === 'string'
      ? mapTransform(props.path)
      : (value: unknown) => value
  const sizeGetter =
    typeof props.sizePath === 'string'
      ? mapTransform(props.sizePath)
      : () => undefined

  return function split(data: unknown, { rev: isRev = false }): unknown {
    const size = numberOrDefault(sizeGetter(data), props.size)
    const value = numberToString(valueGetter(data))

    if (typeof size === 'number') {
      return isRev ? rev(value, size) : fwd(value, size)
    } else {
      return value
    }
  }
}

export default transformer
