import mapAny from 'map-any'
import { getPathOrData, getPathOrDefault } from './utils/getters.js'
import { parseNum } from './utils/cast.js'
import { isString, isNumber, isNumeric } from './utils/is.js'
import xor from './utils/xor.js'
import type { AsyncTransformer } from 'map-transform/types.js'

export interface Props extends Record<string, unknown> {
  path?: string
  size?: number
  sizePath?: string
  sep?: unknown | unknown[]
  sepPath?: string
}

const numberToString = (value: unknown) =>
  isNumber(value) ? String(value) : value

const splitStringBySize = (value: string, size: number) =>
  value.match(new RegExp(`.{1,${size}}`, 'g')) || [] // eslint-disable-line security/detect-non-literal-regexp

function splitArrayBySize(value: unknown[], size: number) {
  const ret = []
  for (let i = 0; i < value.length; i += size) {
    ret.push(value.slice(i, i + size))
  }
  return ret
}

function splitStringBySep(value: string, sep: string | string[]) {
  if (Array.isArray(sep)) {
    return sep.reduce(
      (arr, sep) => arr.flatMap((value) => value.split(sep)),
      [value],
    )
  } else {
    return value.split(sep)
  }
}

function splitArrayBySep(arr: unknown[], sep: string | string[]) {
  const ret: unknown[][] = [[]]
  let arrIndex = 0
  const seps = Array.isArray(sep) ? sep : [sep]
  for (const item of arr) {
    const realItem = numberToString(item)
    if (isString(realItem) && seps.includes(realItem)) {
      ret.push([])
      arrIndex += 1
    } else {
      // eslint-disable-next-line security/detect-object-injection
      ret[arrIndex].push(item)
    }
  }
  return ret
}

function joinArrayBySep(arrays: unknown[][], sep: string) {
  const ret: unknown[] = []
  for (const arr of arrays) {
    if (ret.length > 0) {
      // Insert the seperator unless this is the first array
      ret.push(sep)
    }
    ret.push(...arr)
  }
  return ret
}

const hasSubArrays = (arr: unknown[]): arr is unknown[][] =>
  arr.some((value) => Array.isArray(value))

const isArrayWithStrings = (arr: unknown[]): arr is string[] =>
  arr.some((value) => isString(value))

const isArrayWithArrays = (arr: unknown[]): arr is unknown[][] =>
  arr.some((value) => Array.isArray(value))

function bySizeFwd(value: unknown, size: number) {
  if (isString(value)) {
    return splitStringBySize(value, size)
  } else if (Array.isArray(value)) {
    return splitArrayBySize(value, size)
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

function bySepFwd(value: unknown, sep: string | string[]) {
  if (isString(value)) {
    return splitStringBySep(value, sep)
  } else if (Array.isArray(value)) {
    return splitArrayBySep(value, sep)
  } else {
    return value
  }
}

function bySepRev(value: unknown, sep: string | string[]) {
  if (Array.isArray(value)) {
    const realSep = Array.isArray(sep) ? sep[0] : sep
    if (isArrayWithStrings(value)) {
      return value.join(realSep)
    } else if (isArrayWithArrays(value)) {
      return joinArrayBySep(value, realSep)
    }
  }
  return value
}

const transformer: AsyncTransformer = function prepareSplit(props: Props) {
  const valueGetter = getPathOrData(props.path)
  const sizeGetter = getPathOrDefault(props.sizePath, props.size, isNumeric)
  const sepGetter = getPathOrDefault(
    props.sepPath,
    props.sep ?? ' ',
    (value) => isString(value) || isNumber(value),
  )

  return () =>
    async function split(data: unknown, state) {
      const isRev = xor(state.rev, state.flip)
      const size = parseNum(await sizeGetter(data))
      const sep = mapAny(numberToString, await sepGetter(data))
      const value = numberToString(await valueGetter(data))

      if (isNumber(size)) {
        return isRev ? bySizeRev(value, size) : bySizeFwd(value, size)
      } else if (isString(sep) || Array.isArray(sep)) {
        return isRev ? bySepRev(value, sep) : bySepFwd(value, sep)
      } else {
        return value
      }
    }
}

export default transformer
