import { Transformer } from 'integreat'
import { unescapeValue } from './utils/escape'

export interface Operands extends Record<string, unknown> {
  skip?: unknown[]
}

const isCountable = (skip: unknown[]) => (value: unknown) =>
  !skip.includes(value)

const transformer: Transformer = ({ skip }: Operands) =>
  function splitRange(data: unknown): number {
    const skipValues = Array.isArray(skip)
      ? skip.map(unescapeValue)
      : [null, undefined]

    return Array.isArray(data)
      ? data.filter(isCountable(skipValues)).length
      : Number(isCountable(skipValues)(data))
  }

export default transformer
