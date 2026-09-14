import mapAny from 'map-any'
import xor from './utils/xor.js'
import normalizeName from './utils/normalizeName.js'
import buildReverseTable from './utils/reverseTable.js'
import {
  getNames,
  resolveLocale,
  toInteger,
  toStyle,
} from './utils/calendarNames.js'
import type { Props } from './utils/calendarNames.js'
import type { Transformer } from 'map-transform/types.js'

export type { Props }

// Reverse lookup tables are shared between all transformers with the same
// locale, and are only built the first time they are needed
const reverseTables = new Map<string, Map<string, number | null>>()

// Both long and short names are matched, whatever the style
const buildMonthTable = (locale: string) =>
  buildReverseTable(
    [
      ...getNames('month', 'long', locale),
      ...getNames('month', 'short', locale),
    ].map((name, index): [string, number] => [name, (index % 12) + 1]),
  )

function getReverseTable(locale: string) {
  let table = reverseTables.get(locale)
  if (!table) {
    table = buildMonthTable(locale)
    reverseTables.set(locale, table)
  }
  return table
}

const monthName = (names: string[]) =>
  function getMonthName(value: unknown) {
    const month = toInteger(value)
    return month !== undefined && month >= 1 && month <= 12
      ? names[month - 1]
      : undefined
  }

const monthNumber = (locale: string) =>
  function getMonthNumber(value: unknown) {
    return typeof value === 'string'
      ? (getReverseTable(locale).get(normalizeName(value)) ?? undefined)
      : undefined
  }

const transformer: Transformer =
  ({ locale, style }: Props) =>
  () => {
    const resolvedLocale = resolveLocale(locale)
    const names = getNames('month', toStyle(style), resolvedLocale)
    const toName = mapAny(monthName(names))
    const toNumber = mapAny(monthNumber(resolvedLocale))
    return (value, state) =>
      xor(state.rev, state.flip) ? toNumber(value) : toName(value)
  }

export default transformer
