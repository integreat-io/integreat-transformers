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
const buildWeekDayTable = (locale: string) =>
  buildReverseTable(
    [
      ...getNames('weekday', 'long', locale),
      ...getNames('weekday', 'short', locale),
    ].map((name, index): [string, number] => [name, index % 7]),
  )

function getReverseTable(locale: string) {
  let table = reverseTables.get(locale)
  if (!table) {
    table = buildWeekDayTable(locale)
    reverseTables.set(locale, table)
  }
  return table
}

const weekDayName = (names: string[]) =>
  function getWeekDayName(value: unknown) {
    const day = toInteger(value)
    return day !== undefined && day >= 0 && day <= 7
      ? names[day % 7] // Both 0 and 7 are Sunday
      : undefined
  }

const weekDayNumber = (locale: string) =>
  function getWeekDayNumber(value: unknown) {
    return typeof value === 'string'
      ? (getReverseTable(locale).get(normalizeName(value)) ?? undefined)
      : undefined
  }

const transformer: Transformer =
  ({ locale, style }: Props) =>
  () => {
    const resolvedLocale = resolveLocale(locale)
    const names = getNames('weekday', toStyle(style), resolvedLocale)
    const toName = mapAny(weekDayName(names))
    const toNumber = mapAny(weekDayNumber(resolvedLocale))
    return (value, state) =>
      xor(state.rev, state.flip) ? toNumber(value) : toName(value)
  }

export default transformer
