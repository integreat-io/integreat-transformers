import { Transformer } from 'integreat'
import base64, { base64Decode, base64Encode } from './base64.js'
import boolean from './boolean.js'
import count from './count.js'
import date, { formatDate } from './date.js'
import hash from './hash.js'
import lowercase from './lowercase.js'
import math from './math.js'
import ms from './ms.js'
import now from './now.js'
import number from './number.js'
import replace from './replace.js'
import round from './round.js'
import range from './range.js'
import stringFn from './string.js'
import sum from './sum.js'
import truncate from './truncate.js'
import unique from './unique.js'
import uppercase from './uppercase.js'
import uriPart from './uriPart.js'
import xml from './xml/index.js'

const transformers: Record<string, Transformer> = {
  base64,
  base64Decode,
  base64Encode,
  boolean,
  count,
  date,
  formatDate,
  hash,
  lowercase,
  math,
  ms,
  now,
  number,
  range,
  replace,
  round,
  splitRange: range, // For compatability (old name)
  string: stringFn,
  sum,
  truncate,
  unique,
  uppercase,
  uriPart,
  xml,
}

export default transformers
