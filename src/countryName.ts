import mapAny from 'map-any'
import xor from './utils/xor.js'
import type { Transformer } from 'map-transform/types.js'

export interface Props extends Record<string, unknown> {
  locale?: string
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Codes that have a name in CLDR, but should not be treated as regions:
// Unknown Region and the pseudo-locale test codes
const nonCountryCodes = new Set(['XA', 'XB', 'ZZ'])

// Reverse lookup tables are shared between all transformers with the same
// locale, and are only built the first time they are needed
const reverseTables = new Map<string, Map<string, string>>()

function createDisplayNames(locale?: string) {
  try {
    return new Intl.DisplayNames([locale ?? 'en', 'en'], {
      type: 'region',
      fallback: 'none',
    })
  } catch {
    // Invalid locale tag -- fall back to English
    return new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' })
  }
}

// Make matching of names insensitive to case, accents, and punctuation
const normalizeName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // Remove accents
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase()

// Deprecated codes (like `UK` and `DD`) are canonicalized to their current
// code (`GB` and `DE`), and have the same name as it
const isCanonicalCode = (code: string) =>
  new Intl.Locale('und', { region: code }).region === code

function buildReverseTable(displayNames: Intl.DisplayNames) {
  const table = new Map<string, string>()
  for (const first of LETTERS) {
    for (const second of LETTERS) {
      const code = first + second
      const name = displayNames.of(code)
      if (name && !nonCountryCodes.has(code) && isCanonicalCode(code)) {
        table.set(normalizeName(name), code)
      }
    }
  }
  return table
}

function getReverseTable(displayNames: Intl.DisplayNames) {
  const { locale } = displayNames.resolvedOptions()
  let table = reverseTables.get(locale)
  if (!table) {
    table = buildReverseTable(displayNames)
    reverseTables.set(locale, table)
  }
  return table
}

const countryName = (displayNames: Intl.DisplayNames) =>
  function getCountryName(value: unknown) {
    if (typeof value !== 'string') {
      return undefined
    }
    const code = value.trim().toUpperCase()
    if (nonCountryCodes.has(code)) {
      return undefined
    }
    try {
      return displayNames.of(code)
    } catch {
      return undefined // Malformed code
    }
  }

const countryCode = (displayNames: Intl.DisplayNames) =>
  function getCountryCode(value: unknown) {
    return typeof value === 'string'
      ? getReverseTable(displayNames).get(normalizeName(value))
      : undefined
  }

const transformer: Transformer =
  ({ locale }: Props) =>
  () => {
    const displayNames = createDisplayNames(locale)
    const toName = mapAny(countryName(displayNames))
    const toCode = mapAny(countryCode(displayNames))
    return (value, state) =>
      xor(state.rev, state.flip) ? toCode(value) : toName(value)
  }

export default transformer
