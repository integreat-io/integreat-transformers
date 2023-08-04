import arrToObject from './arrToObject.js'
import base64, { base64Decode, base64Encode } from './base64.js'
import boolean from './boolean.js'
import count from './count.js'
import csv from './csv.js'
import date, { formatDate } from './date.js'
import dedupe from './dedupe.js'
import exclude from './exclude.js'
import hash from './hash.js'
import integer from './integer.js'
import join from './join.js'
import lowercase from './lowercase.js'
import math from './math.js'
import ms from './ms.js'
import now from './now.js'
import number from './number.js'
import objectToArr from './objectToArr.js'
import pattern from './pattern.js'
import replace from './replace.js'
import round from './round.js'
import range from './range.js'
import size from './size.js'
import split from './split.js'
import stringFn from './string.js'
import sum from './sum.js'
import template from './template.js'
import trim from './trim.js'
import truncate from './truncate.js'
import unique from './unique.js'
import uppercase from './uppercase.js'
import uriPart from './uriPart.js'
import validate from './validate.js'
import type { Transformer, AsyncTransformer } from 'integreat'

const transformers: Record<string, Transformer | AsyncTransformer> = {
  arrToObject,
  base64,
  base64Decode,
  base64Encode,
  boolean,
  csv,
  count,
  date,
  dedupe,
  exclude,
  formatDate,
  hash,
  integer,
  join,
  lowercase,
  math,
  ms,
  now,
  number,
  objectToArr,
  pattern,
  range,
  replace,
  round,
  size,
  split,
  splitRange: range, // For compatability (old name)
  string: stringFn,
  sum,
  template,
  trim,
  truncate,
  unique,
  uppercase,
  uriPart,
  validate,
}

export default transformers
