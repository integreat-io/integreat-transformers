import { Transformer } from 'integreat'
import { getPathOrData, getPathOrDefault } from './utils/getters.js'
import { parseNum } from './utils/cast.js'
import { isString, isNumber, isNumeric } from './utils/is.js'

export interface Props extends Record<string, unknown> {
  path?: string
  size?: number
  sizePath?: string
  sep?: string
  sepPath?: string
}

const splitString = (value: string, size: number) =>
  value.match(new RegExp(`.{1,${size}}`, 'g')) || [] // eslint-disable-line security/detect-non-literal-regexp

const numberToString = (value: unknown) =>
  isNumber(value) ? String(value) : value

function splitArray(value: unknown[], size: number) {
  const ret = []
  for (let i = 0; i < value.length; i += size) {
    ret.push(value.slice(i, i + size))
  }
  return ret
}

const hasSubArrays = (arr: unknown[]): arr is unknown[][] =>
  arr.some((value) => Array.isArray(value))

const isArrayWithStrings = (arr: unknown[]): arr is unknown[] =>
  arr.some((value) => isString(value))

function bySizeFwd(value: unknown, size: number) {
  if (isString(value)) {
    return splitString(value, size)
  } else if (Array.isArray(value)) {
    return splitArray(value, size)
  } else {
    return value
  }
}

function bySizeRev(value: unknown, _size: number) {
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

function bySepFwd(value: unknown, sep: string) {
  if (isString(value)) {
    return value.split(sep)
  } else {
    return value
  }
}

function bySepRev(value: unknown, sep: string) {
  if (Array.isArray(value)) {
    if (isArrayWithStrings(value)) {
      return value.join(sep)
    }
  }
  return value
}

const transformer: Transformer = function prepareSplit(props: Props) {
  const valueGetter = getPathOrData(props.path)
  const sizeGetter = getPathOrDefault(props.sizePath, props.size, isNumeric)
  const sepGetter = getPathOrDefault(
    props.sepPath,
    props.sep ?? ' ',
    (value) => isString(value) || isNumber(value)
  )

  return function split(data: unknown, { rev: isRev = false }): unknown {
    const size = parseNum(sizeGetter(data))
    const sep = numberToString(sepGetter(data))
    const value = numberToString(valueGetter(data))

    if (isNumber(size)) {
      return isRev ? bySizeRev(value, size) : bySizeFwd(value, size)
    } else if (isString(sep)) {
      return isRev ? bySepRev(value, sep) : bySepFwd(value, sep)
    } else {
      return value
    }
  }
}

export default transformer
